import { db } from "@/db";
import { communities, resources } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import CommunityNav from "@/components/CommunityNav";
import NewResourceForm from "@/components/NewResourceForm";
import type { CommunityPageProps } from "@/types";

// ============================================================
// COMMUNITY HOMEPAGE
// ============================================================
// This is the main page for a specific community.
// Right now it just shows the community name and description.
//
// YOUR TICKETS WILL ADD:
// - Ticket #1 (Person A): Display a list of posts here
// - Ticket #3 (Person C): Display a list of resources here
// - Ticket #4 (Person A): Add a "New Post" button and form
// - Ticket #6 (Person C): Add an "Add Resource" button and form
// - Ticket #10 (Person B): Improve the layout and styling
// ============================================================

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { communitySlug } = await params;

  const community = await db
    .select()
    .from(communities)
    .where(eq(communities.slug, communitySlug))
    .then((rows) => rows[0]);

  if (!community) {
    notFound();
  }

  const communityResources = await db
    .select()
    .from(resources)
    .where(eq(resources.communityId, community.id));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{community.name}</h1>
        <p className="mt-2 text-gray-600">{community.description}</p>
      </div>

      <CommunityNav slug={community.slug} activeTab="home" />

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Helpful Resources
          </h2>
          <NewResourceForm communityId={community.id} />
        </div>

        {communityResources.length > 0 ? (
          <div className="space-y-3">
            {communityResources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                  {resource.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {resource.description}
                </p>
                <span className="mt-3 block break-all text-sm font-medium text-blue-600">
                  {resource.url}
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
            <p className="text-sm text-gray-500">
              No resources have been shared yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
