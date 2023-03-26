const items = [];

function getAllItems(req, res, next) {
  res.send(items);
}

export default {
  getAllItems
};
