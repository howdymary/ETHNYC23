import json

# Inspired by https://github.com/j2abro/UniswapV2-Sandwich-Attack-Detector

# https://thegraph.com/hosted-service/subgraph/liqwiz/uniswap-v3-goerli 
# Process 1k weth_usdc_pairs & btc_usdc_pairs with logic below 
# We cannot process more than 1k pairs from API

# weth_usdc_pairs query 
'''
{
  swaps(first: 1000,
    where: {pool: "0xd11ee14805642dcb5bf840845836afe3cfc16383"}
    orderBy: transaction__blockNumber
  ) {
    amount0
    amount1
    recipient
    sender
    transaction {
      gasUsed
      gasPrice
      id
      blockNumber
    }
    logIndex
  }
}
'''

# btc_usdc_pairs query 
'''
{
  swaps(first: 1000,
    where: {pool: "0x2322669e19157527f575fb5118a824062a41a4b1"}
    orderBy: transaction__blockNumber
  ) {
    amount0
    amount1
    recipient
    sender
    transaction {
      gasUsed
      gasPrice
      id
      blockNumber
    }
    logIndex
  }
}
'''

# with open('btc_pairs.json') as f:
#     data = json.load(f)

with open('weth_usdc_pairs.json') as f:
    data = json.load(f)

pairs = data['data']['swaps']

blocks = {}

for pair in pairs: 
  block_id = pair["transaction"]["blockNumber"]  
  if block_id in blocks:
      blocks[block_id].append(pair)
  else:
      blocks[block_id] = [pair]    

testable_blocks = {}
for block in blocks:
  # 3 trx are needed for us to check for a sandwiched trx
  if len(blocks[block]) >= 3:
    testable_blocks[block] = blocks[block]
    # For the blocks that have enough trx where we can check for sandwich attacks, we need to sort by logIndex
    sorted_values = sorted(testable_blocks[block], key=lambda x: int(x['logIndex']))
    testable_blocks[block] = sorted_values

print("")
print("Print block IDs that have enough trx to check against Axiom logic for sandwiching")
print("")

for valid_block in testable_blocks:
  print(f"Block: {valid_block}; Size of block: {len(testable_blocks[valid_block])}")
  # for block in testable_blocks[valid_block]:
  #  print(block['transaction']['id'])

print("")
print("Check trx from block using our logic to do initial sandwich check")
print("")

for valid_block in testable_blocks:
  print(f"Block: {valid_block}; Size of block: {len(testable_blocks[valid_block])}")
  for i in range(1, len(testable_blocks[valid_block]) - 1):
    prior_trx = testable_blocks[valid_block][i - 1]
    current_trx = testable_blocks[valid_block][i]
    next_trx = testable_blocks[valid_block][i + 1]
    
    # Get prior trx price
    prior_abs_price = abs(float(prior_trx["amount0"]))
    prior_abs_divide = abs(float(prior_trx["amount1"]))
    # This means we are dividing by an invalid value due to poor data
    if prior_abs_divide == 0: 
      continue
    prior_price = prior_abs_price / prior_abs_divide
    
    # Get current trx price
    current_abs_price = abs(float(current_trx["amount0"]))
    current_abs_divide = abs(float(current_trx["amount1"]))
    # This means we are dividing by an invalid value due to poor data
    if current_abs_divide == 0: 
      continue
    current_price = current_abs_price / current_abs_divide

    # Get next trx price
    next_abs_price = abs(float(next_trx["amount0"]))
    next_abs_divide = abs(float(next_trx["amount1"]))
    # This means we are dividing by an invalid value due to poor data
    if next_abs_divide == 0: 
      continue
    next_price = next_abs_price / next_abs_divide
    
    if prior_price < current_price and current_price < next_price:
      print("")
      print(f"Potential sandwich - block {valid_block}")
      print(f"Prior: price: {prior_price} trx id: {prior_trx['transaction']['id']} log id: {prior_trx['logIndex']}")
      print(f"Current: price: {current_price} trx id: {current_trx['transaction']['id']} log id: {current_trx['logIndex']}")
      print(f"Next: price: {next_price} trx id: {next_trx['transaction']['id']} log id: {next_trx['logIndex']}")
      print("")
