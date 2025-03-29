# -*- coding: utf-8 -*-
import disnake, asyncio
import json
from disnake.ext import commands

config = json.load(open('config.json', 'rb'))
color = config['color']
prefix = "#"
embeds = {"Защита":f'`{prefix}whitelist [Пользователь | ID]` - Добавить пользователя в вайтлист\n\n\
`{prefix}antibot` - банить не верифицированых ботов\n\n\
`{prefix}save` - сохранить сервер\n\n\
`{prefix}backup` - сделать бэкап сервера',
                
"Модерация":f"`{prefix}ban [пользователь] [причина]` - забанить пользователя\n\n\
`{prefix}kick [пользователь] [причина]` - кикнуть пользователя\n\n\
`{prefix}unban [пользователь]` - разбанить пользователя\n\n\
`{prefix}clear [количество сообщений]` - очистить определёное количество сообщений\n\n\
`{prefix}mute [пользователь]` - выдать мут пользователю\n\n\
`{prefix}unmute [пользователь]` - снять мут с пользователя\n\n\
`{prefix}warn [пользователь] [причина]` - выдать предупреждение пользователю\n\n\
`{prefix}unwarns [пользователь]` - снять все предупреждение с пользователя\n\n\
`{prefix}warns` - посмотреть предупреждение пользователя\n\n\
`{prefix}massban [пользователи] [причина]` - забанить сразу несколько пользователей\n\n\
`{prefix}unwarn [пользователь | ID]` - снять предупреждение с пользователя\n\n\
`{prefix}cooldown [секунд]` - установить задержку чата\n\n\
`{prefix}lock` - забрать у всех права писать в чат\n\n\
`{prefix}unlock` - выдать всем права писать в чат",

"Владелец":f"`{prefix}delspamroles`- удалить одинаковые роли\n\n\
`{prefix}delspamchannels` - удалить одинаковые каналы\n\n\
`{prefix}delchan` - Удалить все каналы\n\n\
`{prefix}delroles` - удалить все роли\n\n\
Не ссыте, эти комманды может использовать только Владелец Сервера",

"Логи":f"`{prefix}log_channel [Канал | ID]` - включить оповещение действий в определёный канал",

"Настройка":f"`{prefix}ignore_channel [Канал | ID]` - игнорируемые каналы для последующих параметров\n\n\
`{prefix}antilink` - Запретит смертным кидать ссылки.\n\n\
`{prefix}auto_reg_ban [Дней]` - банит новых пользователей при входе, регистрация которых меньше 30 дней, или ваше значение\n\n\
`{prefix}leaveban` - если пользователь покидает сервер, ему автоматически даётся бан\n\n\
`{prefix}autorole [Роль | ID]` - Начальная роль при входе\n\n\
`{prefix}whitelisted` - Показать юзеров, которые в вайтлисте\n\n",

"Информация":f"`{prefix}info [Пользователь]` - Информация про: [`@Пользователя`; `#Канал`; `:Эмоджи:`; `@Роль`]\n\n\
`{prefix}server_info` - Информация про сервер\n\n\
`{prefix}idea [Идея]` - Отправить идею разрабам\n\n\
`{prefix}bug [Баг]` - Отправить наиденый баг в боте разрабам"
        }
class Dropdown(disnake.ui.Select):
    def __init__(self):

        options = [
            disnake.SelectOption(
                label="Защита", description="Команды защиты", emoji="💻"
            ),
            disnake.SelectOption(
                label="Модерация", description="Команды модерации", emoji="🎯"
            ),
            disnake.SelectOption(
                label="Настройка", description="Настройки вашего сервера", emoji="⚙"
            ),
            disnake.SelectOption(
                label="Логи", description="Логирование вашего сервера", emoji="🔗"
            ),
            disnake.SelectOption(
                label="Владелец", description="Команды, которые может использовать только владелец", emoji="💎"
            ),
            disnake.SelectOption(
                label="Информация", description="Команды информации", emoji="📱"
            )
        ]
        super().__init__(
            placeholder="Меню помощи",
            min_values=1,
            max_values=1,
            options=options,
        )

    async def callback(self, interaction: disnake.MessageInteraction):
        await interaction.response.edit_message(
                    embed = disnake.Embed(
                            title = f":gear: | {self.values[0]}",
                            description = f">>> **{embeds[self.values[0]]}**",
                            color = color
                        )
            )



class Help(commands.Cog):

    def __init__(self, bot):
        self.bot = bot
    
    @commands.command()
    async def help(self, ctx, arg = None):
        if not arg:
            view = disnake.ui.View()
            view.add_item(Dropdown())
            await ctx.send(embed = disnake.Embed(
                    title = ":gear: | Помощь",
                    description = f"""
Используйте свитч внизу, или пишите вручную команды ниже:


`{prefix}{ctx.command} защита` - Команды защиты
`{prefix}{ctx.command} модерация` - Команды модерации
`{prefix}{ctx.command} владелец` - Команды владельца
`{prefix}{ctx.command} логи` - Команды логов
`{prefix}{ctx.command} настройки` - Настройки

[🔗Shohjahon](https://discord.com/oauth2/authorize?client_id=927318907713372170&permissions=8&scope=bot)
                    """,
                    color = int(color)
                ), view = view)
        else:
            try:
                await ctx.send(embed = disnake.Embed(
                        title = f":gear: | {arg.capitalize()}",
                        description = f">>> **{embeds[arg.lower()]}**",
                        color = int(color)
                    ))
            except:
                pass





def setup(bot):
    bot.add_cog(Help(bot))
