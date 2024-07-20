export const normalizePhoneNumber = (phoneNumber: string): string => {
	// Assuming the phone number is an Australian number without country code
	if (phoneNumber.startsWith("0")) {
		return `+61${phoneNumber.substring(1)}`;
	}
	return phoneNumber;
};
