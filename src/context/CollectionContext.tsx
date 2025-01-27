import { createContext, useContext, useState, ReactNode } from 'react';

interface CollectionContextProps {
    selectedCollection: string | null;
    setSelectedCollection: (collectionId: string | null) => void;
    collectionName: string | null;
    setCollectionName: (collectionName: string | null) => void;
}

const CollectionContext = createContext<CollectionContextProps | undefined>(undefined);

export const CollectionProvider = ({ children }: { children: ReactNode }) => {
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
    const [collectionName, setCollectionName] = useState<string | null>(null);

    return (
        <CollectionContext.Provider value={{ collectionName, setCollectionName, selectedCollection, setSelectedCollection }}>
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