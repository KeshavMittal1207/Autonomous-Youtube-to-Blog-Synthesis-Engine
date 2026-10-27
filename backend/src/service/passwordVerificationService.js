import bcrypt from "bcrypt";

export async function passwordVerificationService(password,hashedPassword){
    const verdict = await bcrypt.compare(password,hashedPassword);
    return verdict;
}