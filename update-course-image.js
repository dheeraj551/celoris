const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

async function updateCourseImage() {
    console.log('Updating Web Development Bootcamp course image to standard URL...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase environment variables');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
        .from('courses')
        .update({ course_image_url: '/web-dev-bootcamp-feature.png' })
        .eq('id', '48713643-694c-491f-86d6-5b6e713c1cf3')
        .select();

    if (error) {
        console.error('❌ Error updating course image:', error);
        return;
    }

    console.log('✅ Course image updated successfully:', data[0].course_image_url);
}

updateCourseImage();
