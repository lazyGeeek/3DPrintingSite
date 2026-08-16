import { createClient } from '@supabase/supabase-js';

import { PrintType } from '@/components/print/print-type'

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

export const createSupabaseClient = () => createClient(supabaseUrl!, supabaseKey!);

export async function GetPrintsList() : Promise<PrintType[]>
{
  const prints: PrintType[] = [];

  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from('prints').select('*');

  if (error) {
    console.error(error);
    return prints;
  }

  for (const item of data!) {
    if (item === null) continue;

    let mainImage: string = item.main_image;
    
    const { data: images, error } = await supabase.storage.from(item.images).list('');
    
    if (error) {
      console.error(error);
      continue;
    }
    
    const imagesLink: string[] = [];

    for (const image of images!) {
      if (image === null) continue;

      const { data } = supabase.storage
        .from(item.images)
        .getPublicUrl(image.name);
      
      if (image.id === item.main_image)
        mainImage = data.publicUrl;
      
      imagesLink.push(data.publicUrl);
    }
  
    prints.push({
      Id: item.id,
      Title: item.title,
      Description: item.description,
      Properties: item.properties,
      MainImage: mainImage,
      Images: imagesLink
    } as PrintType);
  }

  return prints;
}
