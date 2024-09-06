import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IoIosArrowDown } from 'react-icons/io';
import { LuArrowDownUp } from 'react-icons/lu';
import { IoMdCheckmark } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';
import { CiSearch } from 'react-icons/ci';


interface Option {
  id: number;
  title: string;
  imageUrl?: string;
}

interface CustomSelectProps {
  placeholder: string;
  selectedIcon?: React.ReactNode;
  filter?: boolean;
  sorting?: boolean;
  disabled?: boolean;
  multiSelect?: boolean;
  closeIcon?: React.ReactNode;
  personIcon?: React.ReactNode;
  selectedOptionClass?: string;
  imageOption?: boolean;
  searchIcon?: React.ReactNode;
}

const fetchPosts = async (): Promise<Option[]> => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts');
  return data.map((item: Option) => ({
    ...item,
    imageUrl: `https://i.pravatar.cc/150?img=${item.id}`, // Örnek resim URL'si
  }));
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  placeholder,
  selectedIcon = <IoMdCheckmark />,
  filter = false,
  sorting = false,
  disabled = false,
  multiSelect = false,
  closeIcon = <IoCloseSharp />,
  personIcon,
  selectedOptionClass = 'bg-[#F9FAFB]',
  imageOption = false,
  searchIcon = <CiSearch />,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAscending, setIsAscending] = useState<boolean>(true);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { data: posts, isLoading, isError } = useQuery<Option[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Option[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleInputClick = () => {
    setIsOpen(!isOpen);
    setIsFocused(true);
  };

  const handleOptionClick = (option: Option) => {
    if (!disabled) {
      if (multiSelect) {
        setSelectedOptions((prevSelected) => {
          const alreadySelected = prevSelected.some((item) => item.id === option.id);
          if (alreadySelected) {
            return prevSelected.filter((item) => item.id !== option.id);
          }
          if (prevSelected.length < 3) {
            return [...prevSelected, option];
          }
          return prevSelected;
        });
      } else {
        setSelectedOptions([option]);
        setSearchTerm(option.title); // Arama terimini seçilen option'a güncelle
        setIsOpen(false);
      }
    }
  };

  const handleOptionRemove = (option: Option) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.filter((item) => item.id !== option.id)
    );
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !inputRef.current?.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setIsFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (posts) {
      let updatedPosts = [...posts];
      if (filter) {
        updatedPosts = updatedPosts.filter((post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (sorting) {
        updatedPosts.sort((a, b) => {
          if (isAscending) {
            return a.title.localeCompare(b.title);
          } else {
            return b.title.localeCompare(a.title);
          }
        });
      }
      setFilteredPosts(updatedPosts);
    }
  }, [posts, searchTerm, isAscending, filter, sorting]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  const isOptionDisabled = (option: Option) => {
    return (
      multiSelect &&
      selectedOptions.length >= 3 &&
      !selectedOptions.some((item) => item.id === option.id)
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Input değerini arama terimine güncelle
  };

  const handleSortingClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Select box'ı etkilenmeden sadece sıralamayı yap
    setIsAscending(!isAscending);
  };

  return (
    <div className="relative w-[14rem]">
      <div className="relative" ref={inputRef}>
        <div
          className={`relative flex items-center border rounded-md p-2 bg-white cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleInputClick}
          style={{
            border: isFocused || isOpen ? '3px solid #D8BFFB' : '1px solid #dcdcdc',
            width: multiSelect ? '300px' : '224px'
          }}
        >
          {filter && searchIcon && (
            <span className="mr-2 text-gray-400">{searchIcon}</span>
          )}

          <span className="flex-1">
            {filter ? (
              <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleSearchChange}
                className="outline-none w-full"
              />
            ) : selectedOptions.length > 0 ? (
              <div className="flex items-center gap-2 flex-wrap">
                {multiSelect ? (
                  selectedOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`border rounded-md p-1 flex text-sm ${selectedOptionClass}`}
                      style={{ border: '1px solid #dcdcdc', backgroundColor: '#F9FAFB', fontSize:'9px' }}
                    >
                      {imageOption && option.imageUrl && (
                        <img
                          src={option.imageUrl}
                          alt={option.title}
                          className="w-4 h-4 rounded-full mr-1"
                        />
                      )}
                      {!imageOption && personIcon && (
                        <span className="mr-2">{personIcon}</span>
                      )}
                      <span className="text-ellipsis overflow-hidden">
                        {option.title}
                      </span>
                      {closeIcon && (
                        <span
                          className="cursor-pointer ml-2 text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionRemove(option);
                          }}
                        >
                          {closeIcon}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2">
                    {imageOption && selectedOptions[0]?.imageUrl && (
                      <img
                        src={selectedOptions[0].imageUrl}
                        alt={selectedOptions[0].title}
                        className="w-4 h-4 rounded-full mr-1"
                      />
                    )}
                    {!imageOption && personIcon && (
                      <span className="mr-2">{personIcon}</span>
                    )}
                    <span>{selectedOptions[0]?.title}</span>
                  </div>
                )}
              </div>
            ) : (
              placeholder
            )}
          </span>

          {sorting && (
            <LuArrowDownUp
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-lg cursor-pointer"
              onClick={handleSortingClick}
            />
          )}
          <IoIosArrowDown
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-lg ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg mt-1 z-10 max-h-60 overflow-auto">
            
            {filteredPosts.map((option) => (
              <div
                key={option.id}
                className={`cursor-pointer flex items-center p-2 hover:bg-gray-100 ${
                  isOptionDisabled(option) ? 'cursor-not-allowed' : ''
                } ${selectedOptions.some((item) => item.id === option.id) ? selectedOptionClass : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                {imageOption && option.imageUrl && (
                  <img
                    src={option.imageUrl}
                    alt={option.title}
                    className="w-4 h-4 rounded-full mr-2"
                  />
                )}
                {!imageOption && personIcon && (
                  <span className="mr-2">{personIcon}</span>
                )}
                <span className={`flex-1 ${selectedOptions.some((item) => item.id === option.id) ? selectedOptionClass : ''}`}>
                  {option.title}
                </span>
                {selectedOptions.some((item) => item.id === option.id) && selectedIcon}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
