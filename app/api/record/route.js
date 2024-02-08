import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET(req) {
	const { searchParams } = req.nextUrl;
	const date = searchParams.get('date');

	try {
		const result = await kv.exists(`record:${date}`);

		if (result == 0) {
			return NextResponse.json({ data: null }, { status: 200 });
		}

		const records = await kv.get(`record:${date}`);
		return NextResponse.json({ data: records }, { status: 200 });
	} catch (error) {
		// Handle errors
		return NextResponse.json({ code: 'error', msg: 'There is something wrong.' }, { status: 400 });
	}
}

export async function POST(req) {
	const res = await req.json();
	const { date } = res;

	try {
		await kv.set(`record:${date}`, JSON.stringify(res));

		return NextResponse.json({ data: res }, { status: 200 });
	} catch (error) {
		// Handle errors
		return NextResponse.json({ code: 'error', msg: 'There is something wrong.' }, { status: 400 });
	}
}

export async function DELETE(req) {
	const res = await req.json();
	const { date } = res;

	try {
		await kv.del(`record:${date}`);

		return NextResponse.json({ data: res }, { status: 200 });
	} catch (error) {
		// Handle errors
		return NextResponse.json({ code: 'error', msg: 'There is something wrong.' }, { status: 400 });
	}
}
