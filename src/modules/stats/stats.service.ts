import Project from "../project/project.model";
import Blog from "../blog/blog.model";
import Contact from "../message/message.model";
import Skill from "../skill/skill.model";
import Certification from "../certification/certification.model";
import Education from "../education/education.model";
import Testimonial from "../testimonial/testimonial.model";

type GroupResult = { _id: string; count: number }[];

const toRecord = (arr: GroupResult): Record<string, number> =>
  arr.reduce<Record<string, number>>((acc, { _id, count }) => {
    if (_id) acc[_id] = count;
    return acc;
  }, {});

export const getStatsService = async () => {
  const notDeleted = { isDeleted: { $ne: true } };

  const [
    projectTotal,
    projectByStatus,
    projectFeatured,
    projectByCategory,

    blogTotal,
    blogByStatus,
    blogTotalViews,
    blogFeatured,

    messageTotal,
    messageUnread,
    messageByStatus,

    skillTotal,
    skillFeatured,
    skillByCategory,
    skillByLevel,

    certTotal,
    certActive,
    certExpired,
    certLifetime,
    certFeatured,

    eduTotal,
    eduCurrent,
    eduFeatured,

    testimonialTotal,
    testimonialFeatured,
    testimonialByRelation,
  ] = await Promise.all([
    // Projects
    Project.countDocuments(notDeleted),
    Project.aggregate([
      { $match: notDeleted },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]) as Promise<GroupResult>,
    Project.countDocuments({ ...notDeleted, featured: true }),
    Project.aggregate([
      { $match: notDeleted },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]) as Promise<GroupResult>,

    // Blogs
    Blog.countDocuments(notDeleted),
    Blog.aggregate([
      { $match: notDeleted },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]) as Promise<GroupResult>,
    Blog.aggregate([
      { $match: notDeleted },
      { $group: { _id: null, total: { $sum: "$views" } } },
    ]),
    Blog.countDocuments({ ...notDeleted, featured: true }),

    // Messages
    Contact.countDocuments(),
    Contact.countDocuments({ status: "UNREAD" }),
    Contact.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]) as Promise<GroupResult>,

    // Skills
    Skill.countDocuments(),
    Skill.countDocuments({ featured: true }),
    Skill.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]) as Promise<GroupResult>,
    Skill.aggregate([
      { $group: { _id: "$level", count: { $sum: 1 } } },
    ]) as Promise<GroupResult>,

    // Certifications
    Certification.countDocuments(notDeleted),
    Certification.countDocuments({ ...notDeleted, isExpired: false }),
    Certification.countDocuments({ ...notDeleted, isExpired: true }),
    Certification.countDocuments({ ...notDeleted, isLifetime: true }),
    Certification.countDocuments({ ...notDeleted, featured: true }),

    // Education
    Education.countDocuments(notDeleted),
    Education.countDocuments({ ...notDeleted, isCurrent: true }),
    Education.countDocuments({ ...notDeleted, featured: true }),

    // Testimonials
    Testimonial.countDocuments(notDeleted),
    Testimonial.countDocuments({ ...notDeleted, featured: true }),
    Testimonial.aggregate([
      { $match: notDeleted },
      { $group: { _id: "$relation", count: { $sum: 1 } } },
    ]) as Promise<GroupResult>,
  ]);

  return {
    projects: {
      total: projectTotal,
      byStatus: toRecord(projectByStatus),
      featured: projectFeatured,
      byCategory: toRecord(projectByCategory),
    },
    blogs: {
      total: blogTotal,
      byStatus: toRecord(blogByStatus),
      totalViews: (blogTotalViews[0]?.total as number) ?? 0,
      featured: blogFeatured,
    },
    messages: {
      total: messageTotal,
      unread: messageUnread,
      byStatus: toRecord(messageByStatus),
    },
    skills: {
      total: skillTotal,
      featured: skillFeatured,
      byCategory: toRecord(skillByCategory),
      byLevel: toRecord(skillByLevel),
    },
    certifications: {
      total: certTotal,
      active: certActive,
      expired: certExpired,
      lifetime: certLifetime,
      featured: certFeatured,
    },
    education: {
      total: eduTotal,
      current: eduCurrent,
      completed: eduTotal - eduCurrent,
      featured: eduFeatured,
    },
    testimonials: {
      total: testimonialTotal,
      featured: testimonialFeatured,
      byRelation: toRecord(testimonialByRelation),
    },
  };
};
