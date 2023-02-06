export const getCircumfence = (radius: number) => radius * 2 * Math.PI;

export const toastifySuccessStyles = {
  background:  typeof window !== "undefined" && localStorage.getItem("theme") === "dark" ? "#222831" : "#6D9886",
  color: "#fff",
};

export const toastifyErrorStyles = {
  background: "#222831",
  color: "#9F73AB",
};

export const messages = {
  createCollection: "🦄 Collection's created!",
  updateCollection: "🦄 Collection's updated!",
  deleteCollection: "🦄 Collection's deleted!",
  favouriteCollection: "🦄 Collection's added to favourite list!",
  unfavouriteCollection: "🦄 Collection's removed from favourite list!",
  createTask: "🦄 Task's created!",
  updateTask: "🦄 Task's updated!",
  deleteTask: "🦄 Task's deleted!",
  doneTask: "🦄 Task's done!",
  undoneTask: "🦄 Task's undone!",
  createSubTask: "🦄 Sub task's created!",
  errorMessage: "❌ Something went wrong!",
};
