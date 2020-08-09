export const prettyInsert = (result) => ({
  result: result.result,
  connection: "not displayed",
  message: "not displayed",
  ops: result.ops,
  insertedCount: result.insertedCount,
  insertedId: result.insertedId,
});
export const prettyInsertOne = prettyInsert;
export const prettyInsertMany = (result) => result;

export const prettyDelete = (result) => ({
  result: result.result,
  connection: "not displayed",
  message: "not displayed",
  deletedCount: result.deletedCount,
});
export const prettyDeleteOne = prettyDelete;
export const prettyDeleteMany = prettyDelete;

export const prettyUpdate = (result) => ({
  result: result.result,
  connection: "not displayed",
  message: "not displayed",
  modifiedCount: result.modifiedCount,
  upsertedId: result.upsertedId,
  upsertedCount: result.upsertedCount,
  matchedCount: result.matchedCount,
});
export const prettyUpdateOne = prettyUpdate;
export const prettyUpdateMany = prettyUpdate;

export const prettyReplace = (result) => ({
  result: result.result,
  connection: "not displayed",
  message: "not displayed",
  modifiedCount: result.modifiedCount,
  upsertedId: result.upsertedId,
  upsertedCount: result.upsertedCount,
  matchedCount: result.matchedCount,
  ops: result.ops,
});
export const prettyReplaceOne = prettyReplace;
