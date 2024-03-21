import "server-only";
import docker from "@/lib/docker";
import prisma from "@/lib/prisma";
type Image = `ghcr.io/spaceness/${string}`;
export async function createSession(image: Image, userId: string) {}
