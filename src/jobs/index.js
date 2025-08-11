module.exports = () => {
    //JOB TIKLUY
    require('./updateTokenThirdParty')();
    require('./updateTokenUser')();
    require('./downloadContracts')();

    //JOB VNFITE
    require('./updateTokenUserVNF')();
    require('./updateTokenThirdPartyVNF')();
};