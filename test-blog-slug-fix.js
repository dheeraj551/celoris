async function testBlogSlugFix() {
    console.log('Testing blog slug API fix...');

    const slug = 'sobhita-dhulipala-serves-fierce-secret-agent-vibes-in-stunning-new-photos-fans-are-obsessed-159263';
    const url = `http://localhost:3000/api/blog/${slug}`;

    try {
        console.log(`Calling: ${url}`);
        const response = await fetch(url);
        console.log('Status:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ API call successful');
            console.log('Post title:', data.post?.title);
            console.log('Post slug:', data.post?.slug);
        } else {
            console.error('❌ API call failed');
            const text = await response.text();
            console.error('Response:', text);
        }
    } catch (error) {
        console.error('❌ Network error:', error.message);
    }
}

testBlogSlugFix();
