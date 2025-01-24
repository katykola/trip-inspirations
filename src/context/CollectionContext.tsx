import { createContext, useContext, useState, ReactNode } from 'react';

interface CollectionContextProps {
    selectedCollection: string | null;
    setSelectedCollection: (collectionId: string) => void;
}

const CollectionContext = createContext<CollectionContextProps | undefined>(undefined);

export const CollectionProvider = ({ children }: { children: ReactNode }) => {
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

    return (
        <CollectionContext.Provider value={{ selectedCollection, setSelectedCollection }}>
            {children}
        </CollectionContext.Provider>
    );
};

export const useCollection = () => {
    const context = useContext(CollectionContext);
    if (context === undefined) {
        throw new Error('useCollection must be used within a CollectionProvider');
    }
    return context;
};