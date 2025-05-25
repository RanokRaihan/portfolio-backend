import Blog from "../blog/blog.model";
import Project from "../project/project.model";
import Skill from "../skill/skill.model";
import { IDashboardInsight } from "./dashboard.interface";

export const getDashboardInsightService =
  async (): Promise<IDashboardInsight> => {
    // Get project insights
    const projectStats = await Project.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          byStatus: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    // Get skill insights
    const skillStats = await Skill.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          featured: [{ $match: { featured: true } }, { $count: "count" }],
          byProficiency: [
            {
              $group: {
                _id: "$proficiencyLevel",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    // Get blog insights
    const blogStats = await Blog.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          byStatus: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    // Process project stats
    const totalProjects = projectStats[0].total[0]?.count || 0;
    const projectByStatus = projectStats[0].byStatus.reduce(
      (acc: Record<string, number>, curr: any) => {
        acc[curr._id] = curr.count;
        return acc;
      },
      {}
    );

    // Process skill stats
    const totalSkills = skillStats[0].total[0]?.count || 0;
    const featuredSkills = skillStats[0].featured[0]?.count || 0;
    const skillByProficiency = skillStats[0].byProficiency.reduce(
      (acc: Record<string, number>, curr: any) => {
        acc[curr._id] = curr.count;
        return acc;
      },
      {}
    );

    // Process blog stats
    const totalBlogs = blogStats[0].total[0]?.count || 0;
    const blogByStatus = blogStats[0].byStatus.reduce(
      (acc: Record<string, number>, curr: any) => {
        acc[curr._id] = curr.count;
        return acc;
      },
      {}
    );

    return {
      project: {
        total: totalProjects,
        completed: projectByStatus["completed"] || 0,
        inProgress: projectByStatus["in-progress"] || 0,
        planned: projectByStatus["planned"] || 0,
      },
      skill: {
        total: totalSkills,
        featured: featuredSkills,
        beginner: skillByProficiency["beginner"] || 0,
        intermediate: skillByProficiency["intermediate"] || 0,
        advanced: skillByProficiency["advanced"] || 0,
        expert: skillByProficiency["expert"] || 0,
      },
      blog: {
        total: totalBlogs,
        published: blogByStatus["published"] || 0,
        draft: blogByStatus["draft"] || 0,
      },
    };
  };
