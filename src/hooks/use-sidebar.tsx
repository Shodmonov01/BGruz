import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '@/store/sidebarSlice'; // Import the toggle action
import { RootState } from '@/store/store';

export const useSidebar = () => {
    const dispatch = useDispatch();
    const isMinimized = useSelector((state: RootState) => state.sidebar.isMinimized); // Get sidebar state from Redux

    const toggle = () => {
        dispatch(toggleSidebar()); // Dispatch action to toggle sidebar state
    };

    return { isMinimized, toggle }; // Return the state and toggle function
};
