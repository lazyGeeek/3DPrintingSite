import { createClient } from '@supabase/supabase-js';

import { HeaderInfo } from '@/components/home/header-info'
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
    
    const storage = supabase.storage.from(item.images);
    const { data: images, error } = await storage.list('');
    
    if (error) {
      console.error(error);
      continue;
    }
    
    const imagesLink: string[] = [];

    for (const image of images!) {
      if (image === null) continue;

      const { data } = storage.getPublicUrl(image.name);
      
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

export async function GetHeadersList() : Promise<HeaderInfo[]>
{
  const headers: HeaderInfo[] = [];

  const supabase = createSupabaseClient();
  const { data, error: headerError } = await supabase.from('headers').select('*');

  if (headerError) {
    console.error(headerError);
    return headers;
  }

  const headersImages = supabase.storage.from('headers');
  const { data: images, error: imagesError } = await headersImages.list('');

  if (imagesError) {
    console.error(imagesError);
    return headers;
  }

  for (const item of data!) {
    if (item === null) continue;

    let lightImage: string = "";
    let darkImage: string = "";

    for (const image of images!) {
      if (image === null) continue;

      const { data } = headersImages.getPublicUrl(image.name);

      if (image.id === item.light_image)
        lightImage = data.publicUrl;

      if (image.id === item.dark_image)
        darkImage = data.publicUrl;
    }

    headers.push({
      Id: item.id,
      LightImage: lightImage,
      DarkImage: darkImage
    } as HeaderInfo);
  }

  return headers;
}
