export function generateId(db:any){
  return db.collection("_").doc().id;
}
