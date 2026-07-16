export type Task = {
    id: any;
    title: String;
    status: String;
}

export type ErrMsg = {
    status: String;
    message: String;
}

export function validateTaskReqData<Type>(reqData: any): ErrMsg | undefined {

	// if (!reqData.hasOwnProperty('id')){
	// 	console.error("No id in task request");
    //     return {
    //         status: "error",
    //         message: "No id in task request",
    //     }
	// }
    
    // if (!reqData.hasOwnProperty('status')){
    //     console.error("No status in task request");
    //     return {
    //         status: "error",
    //         message: "No status in task request",
    //     }
    // }

	if (!reqData.hasOwnProperty('title')){
	    console.error("No title in task request");
        return {
            status: "error",
            message: "No title in task request",
        }
	}
}
