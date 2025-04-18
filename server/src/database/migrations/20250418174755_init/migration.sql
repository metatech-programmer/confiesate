-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'banned', 'deleted');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('active', 'flagged', 'deleted');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publications" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "PublicationStatus" NOT NULL DEFAULT 'active',
    "user_uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "publication_uuid" TEXT NOT NULL,
    "reporter_uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "publication_uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "publication_uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "comment_content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_uuid_key" ON "users"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "publications_uuid_key" ON "publications"("uuid");

-- CreateIndex
CREATE INDEX "publications_user_uuid_idx" ON "publications"("user_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "reports_uuid_key" ON "reports"("uuid");

-- CreateIndex
CREATE INDEX "reports_publication_uuid_idx" ON "reports"("publication_uuid");

-- CreateIndex
CREATE INDEX "reports_reporter_uuid_idx" ON "reports"("reporter_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "reports_publication_uuid_reporter_uuid_key" ON "reports"("publication_uuid", "reporter_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "likes_uuid_key" ON "likes"("uuid");

-- CreateIndex
CREATE INDEX "likes_publication_uuid_idx" ON "likes"("publication_uuid");

-- CreateIndex
CREATE INDEX "likes_user_uuid_idx" ON "likes"("user_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "likes_publication_uuid_user_uuid_key" ON "likes"("publication_uuid", "user_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "comments_uuid_key" ON "comments"("uuid");

-- CreateIndex
CREATE INDEX "comments_publication_uuid_idx" ON "comments"("publication_uuid");

-- CreateIndex
CREATE INDEX "comments_user_uuid_idx" ON "comments"("user_uuid");

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_publication_uuid_fkey" FOREIGN KEY ("publication_uuid") REFERENCES "publications"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_uuid_fkey" FOREIGN KEY ("reporter_uuid") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_publication_uuid_fkey" FOREIGN KEY ("publication_uuid") REFERENCES "publications"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_publication_uuid_fkey" FOREIGN KEY ("publication_uuid") REFERENCES "publications"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
