import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { prisma } from "./config/database";
import securityConfig from "./config/security";
import appConfig from "./config/app";
import { errorMiddleware } from "./utils/errorHandler";

// Routes
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import publicationRoutes from "./routes/publicationRoutes";
import commentRoutes from "./routes/commentRoutes";
import likeRoutes from "./routes/likeRoutes";
import reportRoutes from "./routes/reportRoutes";
import exportRoutes from "./routes/exportRoutes";

// Load environment variables
dotenv.config();

class Server {
  public app: Application;

  constructor() {
    this.app = express();
    this.configuration();
    this.routes();
    this.errorHandling();
  }

  /**
   * Configure server middleware and security
   */
  private configuration(): void {
    // Basic middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Security middleware
    this.app.use(cors(securityConfig.cors));
    this.app.use(helmet(securityConfig.helmet));
    this.app.use(rateLimit(securityConfig.rateLimit));
  }

  /**
   * Configure API routes
   */
  private routes(): void {
    const baseUrl = `/api/${appConfig.apiVersion}`;

    this.app.get(baseUrl, (_req, res) => {
      res.status(200).json({
        message: `API back-confessions is running ...`,
        version: appConfig.apiVersion,
      });
    });
    this.app.use(`${baseUrl}/auth`, authRoutes);
    this.app.use(`${baseUrl}/users`, userRoutes);
    this.app.use(`${baseUrl}/publications`, publicationRoutes);
    this.app.use(`${baseUrl}/comments`, commentRoutes);
    this.app.use(`${baseUrl}/likes`, likeRoutes);
    this.app.use(`${baseUrl}/reports`, reportRoutes);
    this.app.use(`${baseUrl}/export`, exportRoutes);
  }

  /**
   * Configure error handling
   */
  private errorHandling(): void {
    this.app.use(errorMiddleware);
  }

  /**
   * Start the server
   */
  public async start(): Promise<void> {
    try {
      // Test database connection
      await prisma.$connect();
      console.log("📦 Database connection established");

      this.app.listen(appConfig.port, () => {
        console.log(
          `🚀 Server running on port ${appConfig.port} in ${appConfig.env} mode`
        );
      });
    } catch (error) {
      console.error("❌ Error starting server:", error);
      await prisma.$disconnect();
      process.exit(1);
    }
  }
}

export default Server;