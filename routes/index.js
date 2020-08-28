var express = require('express');
var router = express.Router();
var path = require('path');
const mainDir = process.cwd();

const dcpClient = require('dcp-client');
const { Seal } = require('node-seal');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(mainDir + '/public/html/index.html'));
});

/* POST handler. */
router.post('/', function (req, res) {
  console.log("Search word received: " + req.body.searchWord);

  //compute(req.body.searchWord);

  res.end();
});

async function compute(searchValue) {
  const SEAL = await Seal();

  //Node Seal Stuff
  const schemeType = SEAL.SchemeType.BFV;
  const polyModulusDegree = 4096;
  const bitSizes = [36, 36, 37];
  const bitSize = 20;

  const parms = SEAL.EncryptionParameters(schemeType);

  // Set the PolyModulusDegree
  parms.setPolyModulusDegree(polyModulusDegree);

  // Create a suitable set of CoeffModulus primes
  parms.setCoeffModulus(
      SEAL.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
  );

  // Set the PlainModulus to a prime of bitSize 20.
  parms.setPlainModulus(
      SEAL.PlainModulus.Batching(polyModulusDegree, bitSize)
  );

  let savedDataArray = parms.saveArray();
  let saveDataString = parms.save(); // "XqEQAwUBAABAAAAAAAAAAHicY2QQYAADZgjFELdQgJkVSEtA+YwOf/7zYxN/8A+7OMO///LYxA/wg2kAsk8M9g==" //

  console.log(savedDataArray);
  console.log(saveDataString);

  dcpClient.init().then(async () => {
    const compute = require('dcp/compute');
    const wallet = require('dcp/wallet');

    let job, results, startTime;

    //This function here is pretty much all wrong.
    job = compute.do(async function (savedData) {
      console.log("Saved data" + savedData);
      const {Seal} = require('node-seal');
      const SEAL = await Seal();
      const encParams = SEAL.EncryptionParameters();
      console.log("Enc parms before:" + encParams);
      //encParams.loadArray(savedData);
      encParams.load(savedData);
      console.log("Enc parms after:" +encParams);

      //console.log(SEAL)
      progress();
      return otherParams.polyModulusDegree
    }, [savedData]);

    job.requires('node-seal');

    job.on('accepted',
        function (ev) {
          console.log(` - Job accepted by scheduler, waiting for results`);
          console.log(` - Job has id ${this.id}`);
          startTime = Date.now()
        });

    job.on('complete',
        function (ev) {
          console.log(`Job Finished, total runtime = ${Math.round((Date.now() - startTime) / 100) / 10}s`)
        });

    job.on('readystatechange',
        function (arg) {
          console.log(`new ready state: ${arg}`)
        });

    job.on('result',
        function (ev) {
          console.log(` - Received result for slice ${ev.sliceNumber} at ${Math.round((Date.now() - startTime) / 100) / 10}s`);
          console.log(` * Results: ${ev.result}`);
        });

    job.public.name = 'events example, nodejs';
    job.public.description = 'DCP-Client Example examples/node/events.js';

    // This is the default behaviour - change if you have multiple bank accounts
    //let ks = await wallet.get(); /* usually loads ~/.dcp/default.keystore */
    //job.setPaymentAccountKeystore(ks);


    results = await job.exec(compute.marketValue);
    //results = await job.localExec()
    console.log('Results are: ', results.values())
  });

}

module.exports = router;
