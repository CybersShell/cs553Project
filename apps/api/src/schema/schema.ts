export type Task = {
    id: any;
    title: String;
    projectID: any;
    assignedTo: any;
    status: String;
    description: String;
}
export type Project = {
    id?: any;
    name: String;
    description: String;
    ownerId?: any;
    createdAt?: String;
}

export type User = {
    id?: any;
    role?: String;
    password?: string;
    passwordHash?: string;
    name: String;
    email: String;
}

export type ErrMsg = {
    status: String;
    message: String;
}



export function validateTaskReqData(reqData: any): ErrMsg | undefined {

	if (!reqData.hasOwnProperty('title')){
	    console.error("No title in task request");
        return {
            status: "error",
            message: "No title in task request",
        }
	}
}

export function validateProjectReqData(reqData: any): ErrMsg | undefined {

	if (!reqData.hasOwnProperty('name')){
	    console.error("No name in project request");
        return {
            status: "error",
            message: "No name in project request",
        };
	}
}
