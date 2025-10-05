import { Router } from "express";

import { isLoggedIn } from "../middlewares/auth.middleware.js";

import {
    addProblemToPlaylist,
    createPlaylist,
    deletePlaylistById,
    getAllPlaylists,
    getPlaylistById,
    removeProblemFromPlaylist,
    updatePlaylistById,
} from "../controllers/playlist.controller.js";

const playlistRoutes = Router();

playlistRoutes
    .route("/create")
    .post(isLoggedIn, createPlaylist);

playlistRoutes
    .route("/")
    .get(isLoggedIn, getAllPlaylists);

playlistRoutes
  .route("/get/:playlistId")
  .get(isLoggedIn, getPlaylistById);

playlistRoutes
  .route("/update/:playlistId")
  .put(isLoggedIn, updatePlaylistById);

playlistRoutes
  .route("/delete/:playlistId")
  .delete(isLoggedIn, deletePlaylistById);

playlistRoutes
  .route("/:playlistId/add-problem")
  .post(isLoggedIn, addProblemToPlaylist);

playlistRoutes
  .route("/:playlistId/remove-problem")
  .delete(isLoggedIn, removeProblemFromPlaylist);
export default playlistRoutes;