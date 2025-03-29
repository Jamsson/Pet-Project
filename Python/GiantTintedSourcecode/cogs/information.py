import disnake

from disnake.ext import commands

from typing import Union

class Information(commands.Cog): 

	def __init__(self, bot ):

		self.bot = bot

	@commands.command()
	async def info(self, ctx, argument:Union[disnake.User, disnake.Emoji, disnake.TextChannel, disnake.VoiceChannel, disnake.Role] = None):
		if isinstance(argument, disnake.User):
			embed = disnake.Embed(
							title = f"🌐 | {argument.name}",
							description = f">>> **Айди: `{argument.id}`\n\nПользователь: `{argument.name}#{argument.discriminator}`\n\nДата создания: `{argument.created_at.strftime('%d/%m/%y')}`\n**",
							color = disnake.Colour.red()
						)
			embed.set_thumbnail(url=argument.avatar)
			await ctx.send(
					embed = embed
				)
		if isinstance(argument, disnake.Emoji):
			await ctx.send(
					embed = disnake.Embed(
							title = f"🌐 | {argument.name}",
							description = f">>> **Айди: `{argument.id}`\n\n\
Упоминание: `<:{argument.name}:{argument.id}>`\n\n\
Анимированая: `{bool(argument.animated)}`\n\n\
Дата создания: `{argument.created_at.strftime('%d/%m/%y')}`\n\n\
Эмоджи: `{argument.name}`\n\n\
Ролей используют: `{len(argument.roles)}`\n\n\
Ссылка: {argument.url}**",
							color = disnake.Colour.green()
						)
				)
		if isinstance(argument, disnake.TextChannel) or isinstance(argument, disnake.VoiceChannel):
			await ctx.send(
					embed = disnake.Embed(
							title = f"🌐 | {argument.name}",
							description = f">>> **Канал: [`{argument.name}` | `{argument.id}`]\n\
Категория: `{argument.category}` | `{argument.category_id}`\n\n\
Дата создания: `{argument.created_at.strftime('%d/%m/%y')}`\n\n\
Пользователей, могущих читать сообщения: `{len(argument.members)}`\n\n\
Нсфв метка: `{'Вкл.' if bool(argument.nsfw) else 'Выкл.'}`\n\n\
Количество веток: `{len(argument.threads)}`\n\n\
Слоумод: `{argument.slowmode_delay}`\n\n\
Описание: `{argument.topic}`**",
							color = disnake.Colour.red()
						)
				)
		if isinstance(argument, disnake.Role):
			await ctx.send(
					embed = disnake.Embed(
								title = f"🌐 | {argument.name}",
								description = f">>> **Роль: `{argument.name}` | `{argument.id}`\n\n\
Дата создания: `{argument.created_at.strftime('%d/%m/%y')}`\n\n\
Эмоджи: {str(argument.emoji) if argument.emoji else '`Нету`'}\n\n\
Участников с этой ролью: `{len(argument.members)}`\n\n\
Позиция роли: `{argument.position}`**",
								color = disnake.Colour.red()
						)
				)

def setup(bot):
	bot.add_cog(Information(bot))
