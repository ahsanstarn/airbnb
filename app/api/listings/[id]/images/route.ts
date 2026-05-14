import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAuthenticatedUser } from '@/lib/api-utils';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabase();
    const { data: listing } = await supabase.from('listings').select('business_id').eq('id', params.id).single();
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

    const { data: business } = await supabase.from('businesses').select('id').eq('user_id', user.id).single();
    if (!business || business.id !== listing.business_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    const urls: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${params.id}/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, buffer, { contentType: file.type, upsert: false });
      if (uploadError) continue;
      const { data: { publicUrl } } = supabase.storage.from('listing-images').getPublicUrl(uploadData.path);
      urls.push(publicUrl);
    }

    if (urls.length === 0) {
      return NextResponse.json({ error: 'No images uploaded' }, { status: 400 });
    }

    const { data: current } = await supabase.from('listings').select('images').eq('id', params.id).single();
    const existing = current?.images || [];
    const { error: updateError } = await supabase
      .from('listings')
      .update({ images: [...existing, ...urls] })
      .eq('id', params.id);

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });

    return NextResponse.json({ images: urls });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
