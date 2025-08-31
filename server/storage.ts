import { type User, type InsertUser, type ContactMessage, type InsertContactMessage, type Category, type InsertCategory, type Post, type InsertPost } from "@shared/schema";
import { users, categories, posts, contactMessages } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Posts
  getPosts(): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost & { authorId: string }): Promise<Post>;
  updatePost(id: number, post: InsertPost): Promise<Post>;
  deletePost(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactMessages: Map<string, ContactMessage>;
  private categories: Map<number, Category>;
  private posts: Map<number, Post>;
  private nextCategoryId = 1;
  private nextPostId = 1;

  constructor() {
    this.users = new Map();
    this.contactMessages = new Map();
    this.categories = new Map();
    this.posts = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Create admin user
    const adminId = "admin-user-id";
    const adminUser: User = {
      id: adminId,
      username: "admin",
      password: "$2b$12$TbuicwIfSiZdyB2jGJXWC.Z8dUbdDocdsnwXlEBAALdkKiP5/n6Be", // "password"
      isAdmin: true,
      createdAt: new Date()
    };
    this.users.set(adminId, adminUser);

    // Create sample categories
    const categories = [
      { name: "Kundali Tips", slug: "kundali-tips", description: "Helpful tips and guidance for Kundali analysis" },
      { name: "Astrology Basics", slug: "astrology-basics", description: "Basic concepts and fundamentals of astrology" },
      { name: "Remedies", slug: "remedies", description: "Astrological remedies and solutions" },
      { name: "Festival Guide", slug: "festival-guide", description: "Hindu festivals and their significance" }
    ];

    categories.forEach(cat => {
      const id = this.nextCategoryId++;
      const category: Category = {
        ...cat,
        id,
        createdAt: new Date()
      };
      this.categories.set(id, category);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      isAdmin: insertUser.isAdmin || false,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = { 
      ...insertMessage, 
      id,
      createdAt: new Date()
    };
    this.contactMessages.set(id, message);
    return message;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.nextCategoryId++;
    const category: Category = {
      ...insertCategory,
      id,
      createdAt: new Date()
    };
    this.categories.set(id, category);
    return category;
  }

  // Posts
  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values());
  }

  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(postData: InsertPost & { authorId: string }): Promise<Post> {
    const id = this.nextPostId++;
    const post: Post = {
      ...postData,
      id,
      categoryId: postData.categoryId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: number, postData: InsertPost): Promise<Post> {
    const existingPost = this.posts.get(id);
    if (!existingPost) {
      throw new Error("Post not found");
    }
    
    const updatedPost: Post = {
      ...existingPost,
      ...postData,
      categoryId: postData.categoryId || null,
      updatedAt: new Date()
    };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<void> {
    this.posts.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db
      .insert(contactMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  // Posts
  async getPosts(): Promise<Post[]> {
    return await db.select().from(posts);
  }

  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post || undefined;
  }

  async createPost(postData: InsertPost & { authorId: string }): Promise<Post> {
    const [post] = await db
      .insert(posts)
      .values(postData)
      .returning();
    return post;
  }

  async updatePost(id: number, postData: InsertPost): Promise<Post> {
    const [post] = await db
      .update(posts)
      .set(postData)
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async deletePost(id: number): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }
}

export const storage = new DatabaseStorage();
