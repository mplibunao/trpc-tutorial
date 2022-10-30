import { InferQueryOutput } from '@/utils/trpc'
import React from 'react'

const UserContext = React.createContext<InferQueryOutput<'users.me'>>(null)

export const UserContextProvider = ({
	children,
	value,
}: {
	children: React.ReactNode
	value: InferQueryOutput<'users.me'> | undefined
}) => {
	return (
		<UserContext.Provider value={value || null}>
			{children}
		</UserContext.Provider>
	)
}

export const useUserContext = () => React.useContext(UserContext)
