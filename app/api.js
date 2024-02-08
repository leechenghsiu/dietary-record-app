export const fetchRecord = async date => {
	const result = await fetch(`/api/record?date=${date}`, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	return result.json();
};

export const updateRecord = async record => {
	const result = await fetch('/api/record', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(record),
	});
	return result.json();
};
