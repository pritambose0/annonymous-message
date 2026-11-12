import type { MetadataRoute } from "next";
import mongoose from "mongoose";

import UserModel from "@/model/User";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  try {
    if (!process.env.MONGODB_URI) return routes;

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const users = (await UserModel.find({
      isVerified: true,
      isAcceptingMessage: true,
    })
      .select({ username: 1, _id: 0 })
      .sort({ username: 1 })
      .limit(5000)
      .lean()) as Array<{ username?: string }>;

    for (const user of users) {
      if (!user.username) continue;
      routes.push({
        url: `${siteUrl}/u/${encodeURIComponent(user.username)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error("Error building sitemap", error);
  }

  return routes;
}
