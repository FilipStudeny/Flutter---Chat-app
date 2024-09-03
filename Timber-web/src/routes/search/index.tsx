// SearchPage.tsx
import React from "react";
import { Toaster } from "react-hot-toast";

import UserList from "../../components/Lists/UsersList";

const SearchPage: React.FC = () => (
	<>
		<Toaster position='top-right' reverseOrder={false} />

		{/* User List and Filters Together */}
		<UserList separateFilter />
	</>
);

export default SearchPage;
