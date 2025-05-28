module.exports = () => {
    require('./updateTokenThirdParty')();
    require('./updateTokenUser')();
    require('./downloadContracts')();
};