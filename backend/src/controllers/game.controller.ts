import { Request, Response } from 'express';
import { db } from '../db.ts';

export const getGames = async (req: Request, res: Response) => {
  try {
    const games = await db.query(
      `SELECT g.*, COUNT(p.id) as product_count
       FROM games g
       LEFT JOIN products p ON p.game_id = g.id AND p.active = TRUE
       WHERE g.active = TRUE
       GROUP BY g.id
       ORDER BY g.id ASC`
    );

    return res.json({ success: true, games: games.rows });
  } catch (error: any) {
    console.error('[getGames] Error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil daftar game.' });
  }
};

export const getGameBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const game = await db.get(
      `SELECT * FROM games WHERE slug = ? AND active = TRUE`,
      [slug]
    );

    if (!game) {
      return res.status(404).json({ success: false, message: 'Game tidak ditemukan.' });
    }

    const products = await db.query(
      `SELECT * FROM products WHERE game_id = ? AND active = TRUE ORDER BY price ASC`,
      [game.id]
    );

    return res.json({
      success: true,
      game: {
        ...game,
        products: products.rows
      }
    });
  } catch (error: any) {
    console.error('[getGameBySlug] Error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil detail game.' });
  }
};
