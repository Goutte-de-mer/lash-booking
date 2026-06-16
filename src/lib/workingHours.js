import connect from "./mongodb";
import WorkingHours from "@/models/WorkingHours";

export async function getWorkingHours() {
  await connect();
  const docs = await WorkingHours.find({}).lean();
  return docs.map((doc) => ({ ...doc, _id: doc._id.toString() }));
}
