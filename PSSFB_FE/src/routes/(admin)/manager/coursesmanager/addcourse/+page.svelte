<script lang="ts">
	import { Textarea, Select, Label, Toolbar, ToolbarGroup, ToolbarButton } from 'flowbite-svelte';
	// import { PaperClipOutline, MapPinAltSolid, ImageOutline, CodeOutline, FaceGrinOutline, PapperPlaneOutline } from 'flowbite-svelte-icons';
	import Input from '../../../../../atoms/Input.svelte';

	import { checkExist, showToast } from '../../../../../helpers/helpers';
	import { goto } from '$app/navigation';
	import Button from '../../../../../atoms/Button.svelte';
	import { language } from '../../../../../data/data';
	import { beforeUpdate } from 'svelte';

	import Dropzone from 'svelte-file-dropzone';
	import { currentUser, pageStatus } from '../../../../../stores/store';
	import { getURL, uploadImage } from '../../../../../firebase';
	import { addCourse } from '$lib/services/ModerationServices';

	// let inputType = 'int';

	// const addTestCase = (indexc: number, indexcq: number) => {
	// 	Chapters[indexc].codeQuestions[indexcq].testCases = [
	// 		...Chapters[indexc].codeQuestions[indexcq].testCases,
	// 		initTestCase(inputType)
	// 	];
	// };

	// const hiddenChapter = (index: number) => {
	// 	console.log('clicked');
	// 	const element: any = document.getElementById(`chap${index + 1}div`);
	// 	if (element.classList.contains('h-1')) {
	// 		element.classList.remove('h-1');
	// 		element.classList.add('h-full');
	// 	} else if (element.classList.contains('h-full')) {
	// 		element.classList.remove('h-full');
	// 		element.classList.add('h-1');
	// 	}
	// };

	// const hiddenLession = (indexc: number, index: number) => {
	// 	const element: any = document.getElementById(`lession${index + 1}ofc${indexc + 1}div`);
	// 	if (element.classList.contains('h-1')) {
	// 		element.classList.remove('h-1');
	// 		element.classList.add('h-full');
	// 	} else if (element.classList.contains('h-full')) {
	// 		element.classList.remove('h-full');
	// 		element.classList.add('h-1');
	// 	}
	// };

	// const hiddenCodeQuestion = (indexc: number, index: number) => {
	// 	const element: any = document.getElementById(`CodeQuestion${index + 1}ofc${indexc + 1}div`);
	// 	if (element.classList.contains('h-1')) {
	// 		element.classList.remove('h-1');
	// 		element.classList.add('h-full');
	// 	} else if (element.classList.contains('h-full')) {
	// 		element.classList.remove('h-full');
	// 		element.classList.add('h-1');
	// 	}
	// };

	// const AddChapter = () => {
	// 	Chapters = [...Chapters, initChapter()];
	// };

	// const AddLession = (index: number) => {
	// 	Chapters[index].lessons = [...Chapters[index].lessons, initLessions()];
	// };

	// const AddCodeQuestion = (index: number) => {
	// 	Chapters[index].codeQuestions = [...Chapters[index].codeQuestions, intitCodeQuestion()];
	// };

	// const AddQuestion = (indexc: number, lindex: number) => {
	// 	Chapters[indexc].lessons[lindex].questions = [
	// 		...Chapters[indexc].lessons[lindex].questions,
	// 		initQuestion()
	// 	];
	// };

	// const AddAnswer = (indexc: number, lindex: number, qindex: number) => {
	// 	Chapters[indexc].lessons[lindex].questions[qindex].answerOptions = [
	// 		...Chapters[indexc].lessons[lindex].questions[qindex].answerOptions,
	// 		initAnswer(true)
	// 	];
	// };

	// const AddCourse = async () => {
	// 	const course = {
	// 		name: CourseName,
	// 		description: Description,
	// 		picture: Picture,
	// 		tag: Tag,
	// 		createdBy: $currentUser.UserID,
	// 		chapters: Chapters
	// 	};
	// 	console.log('addcourse', JSON.stringify(course));
	// 	await addCourse(course);
	// 	goto('/manager/courseslist');
	// };

	// export let form: any;

	// if (form?.type == 'success') {
	// 	showToast('Add Course', form.message, form.type);
	// } else if (form?.type == 'error') {
	// 	showToast('Add Course', form.message, form.type);
	// }

	let course: any = {
		name: undefined,
		description: undefined,
		picture: undefined,
		tag: 'C#',
		createdBy: $currentUser.UserID
	};

	// beforeUpdate(() => {
	// 	if (form?.response && form?.type == 'success') {
	// 		goto(`addcourse/addchapter/${form?.response.id}`);
	// 	}
	// });

	let image: any;

	function handleFilesSelect(e: any) {
		const { acceptedFiles, fileRejections } = e.detail;
		if (isImage(acceptedFiles[0]?.path)) {
			image = acceptedFiles[0];
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				// Create an image element or use a dedicated image component
				const imageE: any = document.getElementById('img');
				imageE.classList.remove('hidden');
				imageE.src = reader.result;
				imageE.alt = image.name;
				// Append the image to a container element in your UI
			});
			reader.readAsDataURL(image);
		}

		console.log(image);
	}

	function isImage(path: string) {
		if (
			path.includes('jpg') ||
			path.includes('jng') ||
			path.includes('gìf') ||
			path.includes('png') ||
			path.includes('svg')
		)
			return true;
		return false;
	}

	async function frmSubmit(event: any) {
		event.preventDefault();
		if (!checkExist(image)) {
			showToast('Add course', 'Please upload image', 'warning');
		} else {
			pageStatus.set('load');
			await uploadImage(image);
			const url = await getURL(image?.path);
			if (!checkExist(url)) {
				showToast('Add course', 'something went wrong', 'error');
			} else {
				course.picture = url;
				const response = await addCourse(course);
				goto(`addcourse/addchapter/${response.id}`);
			}
			pageStatus.set('done');
		}
	}
</script>

<!-- <div>
	<form>
		<Label defaultClass=" mb-3 block">Course Name</Label>
		<Input
			bind:value={CourseName}
			classes="block w-1/3 ml-4 border mb-5"
			placehoder="Course Name"
		/>
		
		<Label defaultClass=" mb-3 block">Description</Label>
		<div class="mb-5 ml-4"><Textarea bind:value={Description} placeholder="Description" /></div>
		<Label defaultClass=" mb-3 block">Picture</Label>
		<Input bind:value={Picture} classes="block w-1/3 ml-4 border mb-5" placehoder="url link" />
		<Label>
			Language
			<Select class="mt-2 ml-4" items={language} bind:value={Tag} />
		</Label>

		<hr class="my-5 block" />

		<div class="pl-5">
			<div class="text-3xl font-medium mb-5">Chapters</div>

			{#each Chapters as chapter, indexc}
				<div
					role="button"
					tabindex="0"
					on:keydown={() => hiddenChapter(indexc)}
					on:click={() => hiddenChapter(indexc)}
					class="flex items-center text-xl font-medium mb-5"
				>
					Chapters #{indexc + 1}
					<Icon icon="eva:arrow-down-fill" class="ml-3" />
				</div>
				<div id="chap{indexc + 1}div" class="overflow-hidden h-full transition-all">
					<Label defaultClass=" mb-3 block">Chapter Name</Label>
					<input
						class="p-3 text-black border rounded-lg ml-3 w-1/3 mb-5"
						placeholder="Chapter Name"
						bind:value={chapter.Name}
					/>
					<Label defaultClass=" mb-3 block">Part</Label>
					<input
						class="p-3 text-black border rounded-lg ml-3 w-1/3 mb-5"
						placeholder="Chapter Name"
						bind:value={chapter.Part}
					/>
					<Label defaultClass=" mb-3 block">Chapter Description</Label>
					<div class="mb-5 ml-3">
						<Textarea bind:value={chapter.Description} placeholder="Chapter Description" />
					</div>

					<hr class="my-5" />

					<div class="pl-5 mb-5">
						<div class="text-2xl font-medium mb-5">Lessions of chapter {chapter.Name}</div>

						{#each chapter.lessons as lession, indexl}
							<div
								role="button"
								tabindex="0"
								on:keydown={() => hiddenLession(indexc, indexl)}
								on:click={() => hiddenLession(indexc, indexl)}
								class="flex items-center text-xl font-medium mb-5"
							>
								Lessions #{indexl + 1}
								<Icon icon="eva:arrow-down-fill" class="ml-3" />
							</div>
							<div id="lession{indexl + 1}ofc{indexc + 1}div" class="h-full overflow-hidden">
								<Label defaultClass=" mb-3 block">Lession Title</Label>
								<input
									class="p-3 text-black border rounded-lg ml-3 w-1/3 mb-5"
									placeholder="Lession Name"
									bind:value={lession.title}
								/>
								<Label defaultClass=" mb-3 block">Video URL</Label>
								<input
									class="p-3 text-black border rounded-lg ml-3 w-1/3 mb-5"
									placeholder="Lession Name"
									bind:value={lession.videoUrl}
								/>
								<Label defaultClass=" mb-3 block">Duration</Label>
								<input
									class="p-3 text-black border rounded-lg ml-3 w-1/3 mb-5"
									placeholder="Lession Name"
									bind:value={lession.duration}
								/>
								<Label defaultClass=" mb-3 block">Lession Content</Label>
								<div class="mb-5 ml-3">
									
									<Editor
										bind:value={lession.description}
										apiKey="rxzla8t3gi19lqs86mqzx01taekkxyk5yyaavvy8rwz0wi83"
									/>
								</div>

								<Label defaultClass=" mb-3 block">Questions of lession {lession.title}</Label>

								{#each lession.questions as question, qindex}
									<input
										class="p-3 ml-5 text-black w-1/3 mb-5 border rounded-lg block"
										placeholder="Question"
										bind:value={question.contentQuestion}
									/>
									<input
										class="p-3 ml-5 text-black w-1/3 mb-5 border rounded-lg block"
										placeholder="Time"
										bind:value={question.time}
									/>
									{#each question.answerOptions as answer}
										<div class="ml-10 mb-5">
											<input placeholder="Answer" bind:value={answer.optionsText} />
											<input type="checkbox" bind:checked={answer.correctAnswer} /> Correct
										</div>
									{/each}
									<button
										on:click={() => AddAnswer(indexc, indexl, qindex)}
										class="py-2 px-5 border rounded-lg ml-5 mb-5 block">Add Answers</button
									>
								{/each}
								<button
									on:click={() => AddQuestion(indexc, indexl)}
									class="py-2 px-5 border rounded-lg mb-5">Add Question</button
								>
							</div>
						{/each}
						<button on:click={() => AddLession(indexc)} class="py-2 px-5 border rounded-lg mb-5"
							>Add Lession</button
						>
					</div>

					{#if checkExist(chapter.codeQuestions) && chapter.codeQuestions.length > 0}
						<div class="pl-5 mb-5">
							<div class="text-2xl font-medium mb-5">CodeQuestions of chapter {chapter.Name}</div>

							{#each chapter.codeQuestions as cq, cqIndex}
								<div
									role="button"
									tabindex="0"
									on:keydown={() => hiddenCodeQuestion(indexc, cqIndex)}
									on:click={() => hiddenCodeQuestion(indexc, cqIndex)}
									class="flex items-center text-xl font-medium mb-5"
								>
									CodeQuestion #{cqIndex + 1}
									<Icon icon="eva:arrow-down-fill" class="ml-3" />
								</div>
								<div
									id="CodeQuestion{cqIndex + 1}ofc{indexc + 1}div"
									class="h-full overflow-hidden"
								>
									<Label defaultClass=" mb-3 block">Description</Label>
									<input
										class="p-3 text-black border rounded-lg ml-3 w-1/3 mb-5"
										placeholder="Lession Name"
										bind:value={cq.description}
									/>
									<Label defaultClass=" mb-3 block">Code Form</Label>
									<CodeEditor2 bind:value={cq.codeForm} />

									<Label defaultClass=" my-3 block">Testcases of codeQuestion</Label>

									{#each cq.testCases as testcase, index}
										<Label defaultClass=" mb-5 ml-5 block">Testcases {index + 1}</Label>
										{#if testcase.inputTypeInt != null || testcase.expectedResultInt!=null}
											Input
											<input
												bind:value={testcase.inputTypeInt}
												type="number"
												class="p-3 ml-5 text-black mb-5 border rounded-lg"
												placeholder="Input"
											/>
											Result
											<input
												bind:value={testcase.expectedResultInt}
												type="number"
												class="p-3 ml-5 text-black mb-5 border rounded-lg"
												placeholder="Result"
											/>
										

										{:else if testcase.inputTypeString!=null || testcase.expectedResultString!=null}
											Input
											<input
												bind:value={testcase.inputTypeString}
												class="p-3 ml-5 text-black w-1/3 mb-5 border rounded-lg block"
												placeholder="Input"
											/>
											Result
											<input
												bind:value={testcase.expectedResultString}
												class="p-3 ml-5 text-black w-1/3 mb-5 border rounded-lg block"
												placeholder="Result"
											/>
										

										{:else if testcase.inputTypeBoolean != null || testcase.expectedResultBoolean !=null}
											<input
												bind:checked={testcase.inputTypeBoolean}
												type="checkbox"
												class="p-3 ml-5 text-black mb-5 border rounded-lg"
												placeholder="Input"
											/>
											Input

											<input
												bind:checked={testcase.expectedResultBoolean}
												type="checkbox"
												class="p-3 ml-5 text-black mb-5 border rounded-lg"
												placeholder="Result"
											/> Result
										{/if}
									{/each}
									<div>
										<Label>
											Testcase Input
											<Select items={inputTypes} bind:value={inputType} />
										</Label>
										<button
											on:click={() => addTestCase(indexc, cqIndex)}
											class="py-2 px-5 border rounded-lg mb-5 block">Add Testcase</button
										>
									</div>
								</div>
							{/each}
							<button
								on:click={() => AddCodeQuestion(indexc)}
								class="py-2 px-5 border rounded-lg mb-5">Add Code Question</button
							>
						</div>
					{/if}
				</div>
			{/each}
			<button on:click={AddChapter} class="py-2 px-5 border rounded-lg">Add Chapter</button>
			<div class="flex justify-end">
				<button on:click={AddCourse} class="py-2 px-5 border rounded-lg">Add Course</button>
			</div>
		</div>
	</form>
</div> -->

<div class="w-4/5">
	<form on:submit={frmSubmit} method="POST" action="?/addcourse">
		<Label defaultClass=" mb-3 block">Add Course</Label>
		<hr class="my-3" />
		<Label defaultClass=" mb-3 block">Course Name</Label>
		<Input
			required={true}
			bind:value={course.name}
			name="name"
			classes="block w-1/3 ml-4 border mb-5"
			placehoder="Course Name"
		/>

		<Label defaultClass=" mb-3 block">Description</Label>
		<div class="mb-5 ml-4">
			<Textarea name="description" bind:value={course.description} placeholder="Description" />
		</div>
		<Label defaultClass=" mb-3 block">Picture</Label>
		<!-- <Input
			id="imginput"
			name="picture"
			value={course?.picture}
			classes="block w-1/3 ml-4 border mb-5"
			placehoder="url link"
		/> -->
		<Dropzone containerClasses="w-1/3 ml-4 mb-5" on:drop={handleFilesSelect} />
		<img class="w-1/3 ml-4 mb-5 hidden" id="img" alt="img" />
		<Label>
			Language
			<Select name="tag" class="mt-2 ml-4" items={language} bind:value={course.tag} />
		</Label>
		<div class="flex justify-end mt-5"><Button content="Save" /></div>
	</form>
</div>
