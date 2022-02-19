/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gameQueue.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbani <mbani@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/02/09 10:52:22 by mbani             #+#    #+#             */
/*   Updated: 2022/02/19 10:49:31 by mbani            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Injectable } from "@nestjs/common";

@Injectable()
export class GameQueueService{
	
	size: number;
	data: Array<any>;
	isPrivate: boolean;
	id: string;
	Clients :Array<string>;
	
	constructor(isPrivate?: boolean, QueueId?: string, expectedClientId?: Array<string>)
	{
		this.size = 0;
		this.data = [];
		this.isPrivate = isPrivate || false;
		this.id = QueueId || null;
		this.Clients = expectedClientId || [];
	}

	addUser(user)
	{
		if (this.isPrivate && !this.Clients.find(element=> element === user.user.id)) 
			return ; // if an unexpected Player cauth ;)
		this.data.push(user);
		this.size += 1;
	}
	
	clearQueue()
	{
		this.data.length = 0;
		this.size = 0;
	}
 
	isfull()
	{
		return (this.size === 2);
	}

	getPlayers()
	{
		let Players: Array<any> = [];
		for(let i = 0 ; i < 2; ++i)
			Players.push(this.data.shift());
		if (this.data.length === 0)	
			this.clearQueue();
		return Players;
	}

	removeUser(user)
	{
		let removed = false;
		this.data = this.data.filter(element => element !== user);
		if (this.size !== this.data.length)
			{removed = true;
			console.log("Removed from Queue");}
		this.size = this.data.length;
		return removed;
	}

	getId()
	{
		return this.id || null;
	}
}
