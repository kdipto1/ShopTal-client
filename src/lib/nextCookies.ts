// "use server";
// import { cookies } from "next/headers";

// export async function setCookie(data: { accessToken: string; role: string }) {
//   await cookies().set("accessToken", data.accessToken);
//   await cookies().set("userRole", data.role);
//   console.log(data);
// }

// "use server";

import { cookies } from "next/headers";

// import { authKey } from "@/contants/authkey";
import { redirect } from "next/navigation";

const setCookie = (data: { accessToken: string; role: string }) => {
  cookies().set("accessToken", data.accessToken);
  cookies().set("userRole", data.role);
  // if (option && option.passwordChangeRequired) {
  //   redirect("/dashboard/change-password");
  // }
  // if (option && !option.passwordChangeRequired && option.redirect) {
  //   redirect(option.redirect);
  // }
};

export default setCookie;
