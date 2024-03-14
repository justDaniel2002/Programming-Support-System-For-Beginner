import { redirect } from '@sveltejs/kit';
import { checkExist, getFormData } from '../../../../../helpers/helpers';
import { addCourse } from '$lib/services/ModerationServices';

export const actions = {
	addcourse: async ({ cookies, request }: any) => {
		const userSTR = cookies.get('user');
		if (!checkExist(userSTR)) {
			redirect(301, '/');
		}
		const user = JSON.parse(userSTR);
		const data = getFormData(await request.formData());
		
		
		try {
			const response = await addCourse({ ...data, createdBy: user.UserID });
			return {
				type: 'success',
				message: 'add course successfully',
				response: response
			};
		} catch (err) {
			return { type: 'error', message: 'something went wrong', error: err };
		}
	}
};
