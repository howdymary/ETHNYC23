import { Halo2Lib, Halo2Data } from "@axiom-crypto/halo2-js";
import { CircuitInputs } from "./constants";

export const circuit = async (
  halo2Lib: Halo2Lib,
  halo2Data: Halo2Data,
  {
    txHashFrontRun,
    txHashVictim,
    txHashBackRun,
    logIdxFrontRun,
    logIdxVictim,
    logIdxBackrunner
  }: CircuitInputs
) => {
  const {
    constant,
    add,
    sub,
    mul,
    and,
    or,
    assertEqual,
    checkLessThan,
    isLessThan,
    div,
    value,
    addToCallback,
    log
  } = halo2Lib;
  const { getReceipt, getTx } = halo2Data;
  //
  //                 _                 _____  ______ _____  _
  //     /\         (_)               |  __ \|  ____|  __ \| |
  //    /  \   __  ___  ___  _ __ ___ | |__) | |__  | |__) | |
  //   / /\ \  \ \/ / |/ _ \| '_ ` _ \|  _  /|  __| |  ___/| |
  //  / ____ \  >  <| | (_) | | | | | | | \ \| |____| |    | |____
  // /_/    \_\/_/\_\_|\___/|_| |_| |_|_|  \_\______|_|    |______|
  //
  //

  let idxFrontTx = getReceipt(txHashFrontRun)
    .txIdx()
    .toCircuitValue();

  let idxVictimTx = getReceipt(txHashVictim)
    .txIdx()
    .toCircuitValue();

  let idxBackTx = getReceipt(txHashBackRun)
    .txIdx()
    .toCircuitValue();

  let gasPriceFrontTx = getTx(txHashFrontRun)
    .gasLimit()
    .toCircuitValue();

  let gasPriceVictim = getTx(txHashVictim)
    .gasLimit()
    .toCircuitValue();

  let gasPriceBackTx = getTx(txHashBackRun)
    .gasLimit()
    .toCircuitValue();

  let blockNumberFrontRun = getReceipt(txHashFrontRun)
    .blockNumber()
    .toCircuitValue();
  let blockNumberVictim = getReceipt(txHashVictim)
    .blockNumber()
    .toCircuitValue();

  const receiptFrontRunner = getReceipt(txHashFrontRun);
  const receiptVictim = getReceipt(txHashVictim);
  const receiptBackRunner = getReceipt(txHashBackRun);

  // retrieves a log entry in the receipt
  const logFrontRunnerTransactionPool = receiptFrontRunner.log(0);
  const logBackRunnerTransactionPool = receiptBackRunner.log(1);

  // gets the address from which the event was emitted from
  const logFrontRunnerTransactionPoolAddress = logFrontRunnerTransactionPool.address();
  const logBackRunnerTransactionPoolAddress = logBackRunnerTransactionPool.address();

  // check front runner gas is greater than victim
  checkLessThan(gasPriceVictim, gasPriceFrontTx);

  // check victim index less than back runner
  checkLessThan(idxVictimTx, idxBackTx);

  // // check front runner index less than victim
  checkLessThan(idxFrontTx, idxVictimTx);

  // // check front runner gas is greater than victim
  checkLessThan(gasPriceVictim, gasPriceFrontTx);

  // // check front runner gas is equal to victim
  assertEqual(blockNumberVictim, blockNumberFrontRun);

  // check that from for front runner is equal to back runner
  // assertEqual(logFrontRunnerTransactionPoolAddress.toCircuitValue(), logBackRunnerTransactionPoolAddress.toCircuitValue());

  // price check
  const logFrontRunner = receiptFrontRunner.log(logIdxFrontRun);
  const logVictim = receiptVictim.log(logIdxVictim);
  const logBackRunner = receiptBackRunner.log(logIdxBackrunner);

  const priorAbs = receiptFrontRunner
    .log(logIdxFrontRun)
    .data(0)
    .toCircuitValue();
  const priorDiv = receiptFrontRunner.log(logIdxFrontRun).data(1);

  const pdLo = priorDiv.lo();

  const b128max = BigInt(0xffffffffffffffffffffffffffffffff);
  const bigLo = pdLo.value();
  let v = sub(constant(b128max), constant(bigLo));

  const currentAbs = receiptVictim
    .log(logIdxVictim)
    .data(0)
    .toCircuitValue();
  const currentDiv = receiptVictim.log(logIdxVictim).data(1);
  const pdLoCurrent = currentDiv.lo();
  const bigLoCurrent = pdLoCurrent.value();
  let vCurrent = sub(constant(b128max), constant(bigLoCurrent));

  const nextAbs = receiptBackRunner
    .log(logIdxBackrunner)
    .data(0)
    .toCircuitValue();
  const nextDiv = receiptBackRunner.log(logIdxBackrunner).data(1);
  const pdLoNext = nextDiv.lo();
  const bigLoNext = pdLoNext.value();
  let vNext = sub(constant(b128max), constant(bigLoNext));

  // check prior price < current price
  let priorPrice = constant(0);
  let currentPrice = constant(0);
  let nextPrice = constant(0);

  if (isLessThan(priorAbs, v)) {
    //reverse ratio and comparison because division must be greater than 1
    priorPrice = div(mul(v, constant(100000)), mul(priorAbs, constant(100000)));
    currentPrice = div(
      mul(vCurrent, constant(100000)),
      mul(currentAbs, constant(100000))
    );
    nextPrice = div(
      mul(vNext, constant(100000)),
      mul(nextAbs, constant(100000))
    );
    checkLessThan(currentPrice, priorPrice);
    checkLessThan(nextPrice, currentPrice);
  } else {
    priorPrice = div(mul(priorAbs, constant(100000)), mul(v, constant(100000)));
    currentPrice = div(
      mul(currentAbs, constant(100000)),
      mul(vCurrent, constant(100000))
    );
    nextPrice = div(
      mul(nextAbs, constant(100000)),
      mul(vNext, constant(100000))
    );

    checkLessThan(priorPrice, currentPrice);
    checkLessThan(currentPrice, nextPrice);
  }
  addToCallback(constant(1));
};
