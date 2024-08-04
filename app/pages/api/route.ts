import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { content, style } = await req.json();

    const payload = {
      prompt: `${style}, ${content}`,
      output_format: "jpeg"
    };

    console.log('Sending request to Stability AI with payload:', payload);

    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
      axios.toFormData(payload),
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "image/*"
        },
      },
    );

    console.log('Received response with status:', response.status);

    if (response.status === 200) {
      const base64Image = Buffer.from(response.data).toString('base64');
      return NextResponse.json(base64Image);
    } else {
      const errorMessage = response.data.toString();
      console.error(`Error response from Stability AI: ${response.status}: ${errorMessage}`);
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }
  } catch (error) {
    console.error('Error generating image:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}