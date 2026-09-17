import { packRepoZip, REPO_ZIP_NAME } from "@/lib/pack-repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const zip = await packRepoZip();
    const body = new Uint8Array(zip);
    return new Response(body, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${REPO_ZIP_NAME}"`,
        "Cache-Control": "no-store",
        "Content-Length": String(body.byteLength),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not pack the repository.";
    return Response.json({ error: message }, { status: 500 });
  }
}
