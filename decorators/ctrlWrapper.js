const decorateController = (ctrl) => {
  const func = async (req, res, next) => {
    await ctrl(req, res, next);
  };
  return func;
};

module.exports = { decorateController };
