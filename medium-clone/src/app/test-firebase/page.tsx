"use client";

import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function TestFirebase() {
  const handleAddData = async () => {
    try {
      const docRef = await addDoc(collection(db, "testData"), {
        message: "Hello Firebase!",
        createdAt: Date.now(),
      });
      alert("Document added with ID: " + docRef.id);
    } catch (err) {
      console.error(err);
      alert("Error adding document");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Test Firebase</h1>
      <button onClick={handleAddData}>Add Test Data</button>
    </div>
  );
}
