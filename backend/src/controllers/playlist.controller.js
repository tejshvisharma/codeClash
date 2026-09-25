
import { db } from "../libs/db.js";
import logger from "../utils/logger.js";

export const createPlaylist = async (req, res) => {
    try {
      const { name, description } = req.body;
      const userId = req.user?.id;
      const requestId = req.requestId;
      const user = await db.user.findUnique({ where: { id: userId } });
      if (!user) {
        logger.debug({ requestId, userId }, "User not found In DB");
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // 1. Validate input on the server side
      if (!name || typeof name !== "string" || name.trim() === "") {
        logger.debug(
          { requestId, userId },
          "Playlist name is missing or invalid"
        );
        return res.status(400).json({
          success: false,
          message: "Playlist name is required and cannot be empty.",
        });
      }

      // Optional: Trim the name before further processing
      const trimmedName = name.trim();

      // 2. Check for existing name for this user
      const existingPlaylist = await db.playlist.findFirst({
        where: {
          name: trimmedName, // Use trimmed name for comparison
          userId: userId,
        },
      });

      if (existingPlaylist) {
        logger.debug(
          { requestId, userId, name: trimmedName },
          "Playlist name already exists for user"
        );
        return res.status(409).json({
          // 409 Conflict is appropriate for duplicates
          success: false,
          message: "A playlist with this name already exists.",
        });
      }

      const playlist = await db.playlist.create({
        data: {
          name: trimmedName,
          description,
          userId,
        },
      });
      if (!playlist) {
        logger.error("Error creating playlist");
        return res.status(500).json({
          success: false,
          message: "Failed creating playlist, try again",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Playlist created successfully",
        playlist,
      });
    } catch (err) {
        logger.error({ requestId, err: err.message, stack: err.stack }, "Error creating playlist");
        return res.status(500).json({
            success: false,
            message: "Error creating playlist",
        });
    }
};
export const deletePlaylistById = async (req, res) => {
    const { playlistId } = req.params;
    const requestId = req.requestId;
    try {
        const playlist = await db.playlist.delete({
            where: {
                id: playlistId
            }
        });
        if (!playlist) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete playlist",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Playlist deleted successfully",
            playlist,
        });
    } catch (err) {
        logger.error({ requestId, playlistId, err: err.message, stack: err.stack }, "Error deleting playlist");
        return res.status(500).json({
            success: false,
            error: "Error deleting playlist",
        });
    }
};
export const getAllPlaylists = async (req, res) => {
    try {
         const userId = req.user?.id;
        const requestId = req.requestId;
        if (!userId) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const playlists = await db.playlist.findMany({
            where: {
                userId,
            },
            include: {
                problems: {
                    include: {
                        problem: true,
                    }
                }
            },
        });

        return res
            .status(200)
            .json({
                success: true,
                message: "Playlists fetched successfully",
                playlists,
            })
    } catch (err) {
        logger.error({ requestId, err: err.message, stack: err.stack }, "Error fetching playlists");
        return res.status(500).json({
            success: false,
            message: "Error fetching playlists",
        });
    }
};
export const getPlaylistById = async (req, res) => {
    const { playlistId } = req.params;
    const userId = req.user?.id;
    const requestId = req.requestId;
    try {
        const playlist = await db.playlist.findFirst({
          where: {
            id: playlistId,
            userId: userId,
          },
          include: {
            problems: {
              include: {
                problem: true,
              },
            },
          },
        });
        if (!playlist) {
            return res.status(404)
                .json({
                    success: false,
                    error: "Playlist not found",
                });
        }
        return res.status(200).json({
            success: true,
            message: "Playlist fetched successfully",
            playlist,
        });
    } catch (err) {
        logger.error({ requestId, playlistId, userId, err: err.message, stack: err.stack }, "Error fetching playlist");
        return res.status(500).json({
            success: false,
            message: "Error fetching playlist",
        });
    }
};
export const updatePlaylistById = async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.user?.id;
  const { name, description } = req.body;
  const requestId = req.requestId;

  try {
    const playlist = await db.playlist.findUnique({
      where: { id: playlistId },
    });
    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }
    if (playlist.userId !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action" });
    }

    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;

    const updated = await db.playlist.update({
      where: { id: playlistId },
      data,
    });

    return res.status(200).json({
      success: true,
      message: "Playlist updated successfully",
      playlist: updated,
    });
  } catch (err) {
    logger.error(
      { requestId, playlistId, err: err.message, stack: err.stack },
      "Error updating playlist"
    );
    return res.status(500).json({
      success: false,
      message: "Error updating playlist",
    });
  }
};


export const addProblemToPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { problemIds } = req.body;
    const requestId = req.requestId;
    try {
        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing problemIds",
            });
        }

        // create record for the each problem in the playlist
        const problemInPlaylist = await db.problemInPlaylist.createMany({
            data: problemIds.map((problemId) => ({
                playlistId,
                problemId,
            })),
        });

        return res.status(200).json({
            success: true,
            message: "Problem added to playlist successfully",
            problemInPlaylist,
        });
    } catch (err) {
        logger.error(
            {
                requestId,
                playlistId,
                problemIds,
                err: err.message,
                stack: err.stack,
            },
            "Error adding problem to playlist"
        );
        return res.status(500).json({
            success: false,
            message: "Error adding problems to playlist",
        });
    }
};

export const removeProblemFromPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { problemIds } = req.body;
    const userId = req.user?.id;
    const requestId = req.requestId;
    try {
        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing problemIds",
            });
        }

        const playlist = await db.playlist.findUnique({
          where: { id: playlistId },
        });
        if (!playlist || playlist.userId !== userId)
          return res
            .status(403)
            .json({ success: false, error: "Unauthorized action" });

        // delete record for the each problem in the playlist
        const deletedproblemInPlaylist = await db.problemInPlaylist.deleteMany({
            where: {
                playlistId,
                problemId: {
                    in: problemIds
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: "Problem removed from playlist successfully",
            deletedproblemInPlaylist,
        });
    } catch (err) {
        logger.error(
            {
                requestId,
                playlistId,
                problemIds,
                err: err.message,
                stack: err.stack,
            },
            "Error removing problem from playlist"
        );
        return res.status(500).json({
            success: false,
            error: "Error removing problems from playlist",
        });
    }
};