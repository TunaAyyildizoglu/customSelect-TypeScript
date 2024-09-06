import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomSelect from './components/CustomSelect';
import { IoMdCheckmark } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';
import { IoCloseSharp, IoPersonOutline } from 'react-icons/io5';
import { GoPerson } from "react-icons/go";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-4">Custom Select Box</h1>
        <div className="flex flex-wrap gap-4">
          <CustomSelect
            placeholder="Select an option"
            selectedIcon={<IoMdCheckmark />}
            filter={false}
            sorting={false}
          />
          <CustomSelect
            placeholder="Select an option"
            selectedIcon={<IoMdCheckmark />}
            personIcon={<GoPerson />}
            filter={false}
            sorting={false}
            imageOption={false}
          />
          <CustomSelect
            placeholder="Select an option"
            selectedIcon={<IoMdCheckmark />}
            filter={false}
            sorting={false}
            imageOption = {true}
          />
          <CustomSelect
            placeholder="Search an option"
            selectedIcon={<IoMdCheckmark />}
            filter={true}
            searchIcon={<CiSearch />}
          />
          <CustomSelect
            placeholder="Sort and Select an option"
            selectedIcon={<IoMdCheckmark />}
            sorting={true}
          />
          <CustomSelect
            placeholder="Select up to 3 options"
            selectedIcon={<IoMdCheckmark />}
            closeIcon={<IoCloseSharp />}
            multiSelect={true}
            //selectedOptionClass="bg-[#F9FAFB];"
          />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default App;
