'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Table, Text, Card, Progress, Divider, Tag, Select, Modal, useModal, Input } from '@geist-ui/core';
import { ArrowLeft, ArrowRight, Edit, Trash, Plus, RotateCw, Send } from '@geist-ui/icons';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';

import { fetchRecord, updateRecord } from './api';
import styles from './styles.module.scss';

dayjs.extend(isToday);

export default function Home() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [currentDate, setCurrentDate] = useState(dayjs());
	const [workout, setWorkout] = useState(null);
	const [consumed, setConsumed] = useState({ c: 0, p: 0, f: 0 });
	const [items, setItems] = useState([]);
	const { visible, setVisible, bindings } = useModal();
	const [loading, setLoading] = useState(false);
	const [record, setRecord] = useState({ name: '', info: { c: null, p: null, f: null } });
	const [edit, setEdit] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const colors = {
		40: '#c50000',
		60: '#f5a623',
		80: '#f5a623',
		100: '#50e3c2',
	};
	const goal = { c: 240, p: 150, f: 70 };

	const asyncFunction = async _date => {
		const { data } = await fetchRecord(_date);
		if (data) {
			setWorkout(data.workout);
			setItems(data.items);
			setConsumed({ c: 0, p: 0, f: 0 });
		} else {
			setWorkout(null);
			setItems([]);
			setConsumed({ c: 0, p: 0, f: 0 });
		}
	};

	useEffect(() => {
		const date = searchParams.get('date');
		if (date) {
			setCurrentDate(dayjs(date, 'YYYY-MM-DD'));
			asyncFunction(date);
		} else {
			asyncFunction(currentDate.format('YYYY-MM-DD'));
		}
	}, []);

	useEffect(() => {
		if (!visible) {
			setLoading(false);
		} else if (!edit) {
			setRecord({ name: '', info: { c: null, p: null, f: null } });
		}
	}, [visible, edit]);

	useEffect(() => {
		if (items.length > 0) {
			const c = items
				.map(item => item.info.c)
				.reduce((accu, curr) => accu + curr, 0)
				.toFixed(1);
			const p = items
				.map(item => item.info.p)
				.reduce((accu, curr) => accu + curr, 0)
				.toFixed(1);
			const f = items
				.map(item => item.info.f)
				.reduce((accu, curr) => accu + curr, 0)
				.toFixed(1);
			setConsumed({ c, p, f });
		} else {
			setConsumed({ c: 0, p: 0, f: 0 });
		}
	}, [items]);

	const handleSave = async () => {
		setLoading(true);

		if (edit) {
			setItems([...items.slice(0, selectedIndex), record, ...items.slice(selectedIndex + 1)]);
		} else {
			setItems([...items, record]);
		}

		setVisible(false);
	};

	const renderName = value => {
		return (
			<Text p style={{ fontSize: 12 }}>
				{value}
			</Text>
		);
	};

	const renderNutrition = value => {
		return (
			<div className={styles.info}>
				{value.c ? <Tag type="lite">C: {value.c}</Tag> : <div style={{ width: 44 }} />}
				{value.p ? <Tag type="lite">P: {value.p}</Tag> : <div style={{ width: 44 }} />}
				{value.f ? <Tag type="lite">F: {value.f}</Tag> : <div style={{ width: 44 }} />}
			</div>
		);
	};

	const renderAction = (value, rowData, index) => {
		const removeHandler = () => {
			setItems(last => last.filter((_, dataIndex) => dataIndex !== index));
		};
		const editHandler = () => {
			setEdit(true);
			setSelectedIndex(index);
			setRecord(rowData);
			setVisible(true);
		};
		return (
			<div style={{ display: 'flex', gap: 4 }}>
				<Button ghost iconRight={<Edit />} auto scale={1 / 3} px={0.6} font="12px" onClick={editHandler} />
				<Button ghost iconRight={<Trash />} auto scale={1 / 3} px={0.6} font="12px" onClick={removeHandler} />
			</div>
		);
	};

	const handleSubmit = async () => {
		setLoading(true);
		const result = await updateRecord({
			date: dayjs(currentDate).format('YYYY-MM-DD'),
			workout,
			items,
		});
		console.log('result', result);
		setLoading(false);
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles.headerWrapper}>
				<Button
					iconRight={<ArrowLeft />}
					auto
					scale={2 / 3}
					px={0.6}
					onClick={() => {
						setCurrentDate(dayjs(currentDate).add(-1, 'day'));
						router.replace(`/?date=${dayjs(currentDate).add(-1, 'day').format('YYYY-MM-DD')}`, {
							scroll: true,
						});
						asyncFunction(dayjs(currentDate).add(-1, 'day').format('YYYY-MM-DD'));
					}}
				/>
				<Text h4 my={0} className={styles.date}>
					{dayjs(currentDate).format('YYYY-MM-DD')}
				</Text>
				{currentDate.isToday() && (
					<Text p my={0} className={styles.isToday}>
						Today
					</Text>
				)}

				<Button
					iconRight={<ArrowRight />}
					auto
					scale={2 / 3}
					px={0.6}
					onClick={() => {
						setCurrentDate(dayjs(currentDate).add(1, 'day'));
						router.replace(`/?date=${dayjs(currentDate).add(1, 'day').format('YYYY-MM-DD')}`, {
							scroll: true,
						});
						asyncFunction(dayjs(currentDate).add(1, 'day').format('YYYY-MM-DD'));
					}}
					disabled={currentDate.isToday()}
				/>
			</div>
			<div className={styles.contentWrapper}>
				<div className={styles.titleWrapper}>
					<Text h3 my={0}>
						Overview
					</Text>
					<Select
						style={{ minWidth: 0 }}
						placeholder="Workout today?"
						value={workout === true ? 'yes' : workout === false ? 'no' : ''}
						onChange={val => setWorkout(val === 'yes')}
						scale={2 / 3}
					>
						<Select.Option value="yes">Yeah 😄</Select.Option>
						<Select.Option value="no">Nope 😢</Select.Option>
					</Select>
				</div>
				<div className={styles.nutritionBoard}>
					<Card>
						<Text p my={0}>
							Carbohydrate
						</Text>
						<div className={styles.progressWrapper}>
							<Text span my={0}>{`${consumed.c}/${goal.c}`}</Text>
							<Text span my={0}>
								{`${
									goal.c - consumed.c >= 0
										? `-${(goal.c - consumed.c).toFixed(1)}g`
										: `+${(consumed.c - goal.c).toFixed(1)}g`
								}`}
							</Text>
						</div>
						<Progress value={consumed.c} max={goal.c} colors={colors} />
					</Card>
					<Card>
						<Text p my={0}>
							Protein
						</Text>
						<div className={styles.progressWrapper}>
							<Text span my={0}>{`${consumed.p}/${goal.p}`}</Text>
							<Text span my={0}>
								{`${
									goal.p - consumed.p >= 0
										? `-${(goal.p - consumed.p).toFixed(1)}g`
										: `+${(consumed.p - goal.p).toFixed(1)}g`
								}`}
							</Text>
						</div>
						<Progress value={consumed.p} max={goal.p} colors={colors} />
					</Card>
					<Card>
						<Text p my={0}>
							Fat
						</Text>
						<div className={styles.progressWrapper}>
							<Text span my={0}>{`${consumed.f}/${goal.f}`}</Text>
							<Text span my={0}>
								{`${
									goal.f - consumed.f >= 0
										? `-${(goal.f - consumed.f).toFixed(1)}g`
										: `+${(consumed.f - goal.f).toFixed(1)}g`
								}`}
							</Text>
						</div>
						<Progress value={consumed.f} max={goal.f} colors={colors} />
					</Card>
				</div>
				<Divider />
				<div className={styles.titleWrapper}>
					<Text h3 my={0}>
						Records
					</Text>
					<Button
						icon={<Plus />}
						auto
						scale={2 / 3}
						px={0.6}
						onClick={() => {
							setEdit(false);
							setVisible(true);
						}}
					>
						Add
					</Button>
				</div>
				<Table data={items} onChange={value => setItems(value)}>
					<Table.Column prop="name" label="name" render={renderName} />
					<Table.Column prop="info" label="info" width={140} render={renderNutrition} />
					<Table.Column prop="action" label="action" width={64} render={renderAction} />
				</Table>
				<div className={styles.titleWrapper} style={{ justifyContent: 'flex-end', gap: 16 }}>
					<Button
						icon={<RotateCw />}
						scale={2 / 3}
						auto
						type="error"
						ghost
						onClick={() => asyncFunction(currentDate.format('YYYY-MM-DD'))}
					>
						Reset
					</Button>
					<Button loading={loading} icon={<Send />} scale={2 / 3} auto ghost onClick={handleSubmit}>
						Submit
					</Button>
				</div>
			</div>
			<Modal {...bindings}>
				<Modal.Title>{edit ? 'Edit a record' : 'Create a new record'}</Modal.Title>
				<Modal.Content>
					<Input
						placeholder="e.g. 100 grams of rice"
						width="100%"
						value={record.name}
						onChange={e => setRecord({ ...record, name: e.target.value })}
					>
						Name
					</Input>
					<Text
						style={{
							fontWeight: 'normal',
							color: '#444',
							padding: '0 0 0 1px',
							marginBottom: '0.5em',
							fontSize: 14,
							lineHeight: 1.5,
						}}
					>
						Info
					</Text>
					<div style={{ display: 'flex', gap: 4 }}>
						<Input
							label="C"
							placeholder="0"
							htmlType="number"
							value={record.info.c}
							onChange={e =>
								setRecord({ ...record, info: { ...record.info, c: parseFloat(e.target.value) } })
							}
						/>
						<Input
							label="P"
							placeholder="0"
							htmlType="number"
							value={record.info.p}
							onChange={e =>
								setRecord({ ...record, info: { ...record.info, p: parseFloat(e.target.value) } })
							}
						/>
						<Input
							label="F"
							placeholder="0"
							htmlType="number"
							value={record.info.f}
							onChange={e =>
								setRecord({ ...record, info: { ...record.info, f: parseFloat(e.target.value) } })
							}
						/>
					</div>
				</Modal.Content>
				<Modal.Action passive onClick={() => setVisible(false)}>
					Close
				</Modal.Action>
				<Modal.Action loading={loading} onClick={handleSave}>
					{edit ? 'Save' : 'Create'}
				</Modal.Action>
			</Modal>
		</div>
	);
}
