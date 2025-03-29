import disnake
import sqlite3
import requests
import os, sys, json
import traceback
from disnake.ext import commands
import keep_alive

config = json.load(open('config.json', 'rb'))
dev_ids = [834377109945319488, 970628302710648863, 692071250968969266]

prefix = '#'

keep_alive.keep_alive()


class Bot(commands.Bot):
    def __init__(self):

        super().__init__(command_prefix=[
            f'{prefix}', '<@!985938937493192874>', '<@985938937493192874>'
        ],
                         intents=disnake.Intents.all(),
                         help_command=None)
        self.data = sqlite3.connect('data.sqlite3', timeout=1)
        self.cursor = self.data.cursor()

    async def on_ready(self):

        stat = disnake.Streaming(name=f"{prefix}help",
                                 url="https://www.twitch.tv/404")
        print("Bot is ready. Logged as ", self.user)
        members = 0
        """		for i in list(map(lambda guild: len(guild.members), self.guilds)):
			members += i"""

        mems = 0
        for i in list(map(lambda guild: len(guild.members), self.guilds)):
            mems += i
        print(f"Юзеров: {mems}\nГильдий: {len(self.guilds)}")

        self.data.execute('CREATE TABLE IF NOT EXISTS "admin"			("id" INT)')
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "antibot"			("guild" INT)')
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "antiev"			("guild" INT)')
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "antilink"		("guild" INT)')
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "autorole"		("id" INT, "role_id" INT)')
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "blacklist"		("id" INT, "reason" TEXT)'
        )
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "channel"			("id" INT, "guild" INT)')
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "channels"		("id" INT, "name" TEXT, "position" INT, "type" TEXT, "cn" TEXT)'
        )
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "emojis"			("id" INT, "url" TEXT)')
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "exceptchan"		("id" INT, "channel" INT)'
        )
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "language"		("guild" INT, "language" TEXT)'
        )
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "leave_ban"		("guild_id" INT)')
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "new_users"		("guild_id" INT, "days" INT)'
        )
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "rls"				("id" INT, "name" TEXT, "position" INT, "color" TEXT)'
        )
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "warns"			("guild" INT, "mem" INT)')
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "wl"				("guild" INT, "id" INT)')
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "guild"			("guildID" INT, "ownerID" INT, "voiceChannelID" INT, "voiceCategoryID" INT)'
        )
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "guildSettings"	("guildID" INT, "channelName" TEXT, "channelLimit" INT)'
        )
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "userSettings"	("userID" INT, "channelName" TEXT, "channelLimit" INT)'
        )
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "voiceChannel"	("userID" INT, "voiceID" INT)'
        )
        self.data.execute(
            'CREATE TABLE IF NOT EXISTS "global_chat"	("name" TEXT, "guild" INT)'
        )
        self.data.commit()

        await self.change_presence(activity=stat)

        for file in os.listdir('./cogs'):
            if file.endswith('.py'):
                self.load_extension(f"cogs.{file[:-3]}")

    async def on_guild_remove(self, guild):
        self.cursor.execute(f"DELETE FROM channels WHERE id = {guild.id}")
        self.cursor.execute(f"DELETE FROM rls WHERE id = {guild.id}")
        self.cursor.execute(f"DELETE FROM channel WHERE guild = {guild.id}")
        self.data.execute(f'DELETE FROM global_chat WHERE guild = {guild.id}')
        self.data.execute(f'DELETE FROM antibot WHERE guild = {guild.id}')
        self.data.execute(f'DELETE FROM antiev WHERE guild = {guild.id}')
        self.data.execute(f'DELETE FROM antilink WHERE guild = {guild.id}')
        self.data.execute(f'DELETE FROM leave_ban WHERE guild_id = {guild.id}')
        self.data.execute(f'DELETE FROM new_users WHERE guild_id = {guild.id}')
        self.data.execute(f'DELETE FROM warns WHERE guild = {guild.id}')
        self.data.execute(f'DELETE FROM wl WHERE guild = {guild.id}')
        self.data.commit()

    async def on_command(self, ctx):
        try:
            requests.post(
                url=
                "https://discord.com/api/webhooks/1012676528649281536/w-5wZK83zpoxt4mqIgUYcsokNBcHJsRxv0MKaZVEK_Lw80qMK368ycp-AMKkuGpy6JXF",
                json={
                    "content":
                    "",
                    "username":
                    "",
                    "embeds": [{
                        "title": f"{ctx.prefix}{ctx.command}",
                        "description":
                        f"**Сервер: `{ctx.guild.name}` | `{ctx.guild.id}`\n\nКанал: `{ctx.channel.name}` | `{ctx.channel.id}`\n\nАвтор: `{ctx.author.name}` | `{ctx.author.id}`\n\nВладелец: `{ctx.guild.owner}` | `{ctx.guild.owner_id}`**\n\nУчастников: `{len(ctx.guild.members)}`",
                        "color": 0xc27c0e
                    }]
                })
        except:
            requests.post(
                url=
                "https://discord.com/api/webhooks/1012676528649281536/w-5wZK83zpoxt4mqIgUYcsokNBcHJsRxv0MKaZVEK_Lw80qMK368ycp-AMKkuGpy6JXF",
                json={
                    "content":
                    "",
                    "username":
                    "",
                    "embeds": [{
                        "title": f"/{ctx.command}",
                        "description":
                        f"**Сервер: `{ctx.guild.name}` | `{ctx.guild.id}`\n\nКанал: `{ctx.channel.name}` | `{ctx.channel.id}`\n\nАвтор: `{ctx.author.name}` | `{ctx.author.id}`\n\nВладелец: `{ctx.guild.owner}` | `{ctx.guild.owner_id}`**\n\nУчастников: `{len(ctx.guild.members)}`",
                        "color": 0xc27c0e
                    }]
                })

    async def on_command_error(self, ctx, error):
        if type(error) == commands.MissingPermissions:
            await ctx.send(embed=disnake.Embed(
                title=':gear: | Упс...',
                description=
                f">>> **Похоже у вас нет прав, чтоб использовать эту команду**",
                color=disnake.Colour(config['color'])))
        if type(error) == commands.CommandNotFound:
            await ctx.send(embed=disnake.Embed(
                title='❌ | 404',
                description=
                f">>> **Похоже, что я не понимаю эту команду. Попробуй еще раз**",
                color=disnake.Colour(config['color'])))
        if type(error) == commands.CommandOnCooldown:
            await ctx.send(embed=disnake.Embed(
                title="💤 | Медленнее...",
                description=
                f">>> **Перед следующим использованием команды, подождите `{round(error.retry_after, 1)} секунд`**",
                color=disnake.Colour(config['color'])))
        if type(error) == disnake.Forbidden:
            await ctx.send(embed=disnake.Embed(
                title="💨 | Нет прав",
                description=
                f">>> **Бот не может выполнить данное действие, из-за недостатка прав**",
                color=disnake.Colour(config['color'])))
        if type(error) == disnake.errors.NotFound:
            await ctx.send("Нет такого...")
        if type(error) == commands.MissingRequiredArgument:
            return
        else:
            try:
                requests.post(
                    url=
                    "https://discord.com/api/webhooks/1012676528649281536/w-5wZK83zpoxt4mqIgUYcsokNBcHJsRxv0MKaZVEK_Lw80qMK368ycp-AMKkuGpy6JXF",
                    data={
                        'content': f"`{ctx.prefix}{ctx.command}` -> {error}"
                    })
            except:
                pass


bot = Bot()






@bot.event
async def on_guild_join(guild):
    embed = disnake.Embed(
        title=f'💜 | Спасибо, что выбрали EpicBot!',
        description=
        f'🚀 **Быстрый старт** \n`1.` Убедитесь, что у меня есть права администратора\n `2.` Переместите мою роль как можно выше, чтобы все мои функции работали правильно \n `3.` Изучите мои команды: `#help` \n 🔗**Ссылки:** \n>>> [Дискорд сервер](https://discord.com/MwTY7vYRb4)',
        color=0x71368a)
    await guild.text_channels[0].send(embed=embed)


@bot.command()
async def dev_help(ctx):
    global dev_ids
    if not ctx.author.id in dev_ids:
        return await ctx.send("**Xмм...**",
                              embed=disnake.Embed(
                                  title=':x:Доступ запрещен',
                                  description=f'Ты не разработчик -_-',
                                  colour=0xf00a0a))
    await ctx.send(embed=disnake.Embed(
        title='📖 | Навигация по командам разработчика',
        description=
        f'>>> **`{prefix}dev_help` - Показывает меню xелп**\n\n**`{prefix}server` - Показывает список всеx серверов + Аиди**\n\n**`{prefix}inv [ID сервера]` - Создает приглашения на сервер где есть бот **\n\n**`{prefix}echo [Текст]` - Отправить текст от лица бота**\n\n**`{prefix}ping` - Показывает задержку бота**',
        colour=disnake.Color.yellow()))


@bot.command()
async def server(ctx):
    global dev_ids
    if not ctx.author.id in dev_ids:
        return await ctx.send("**Xмм...**",
                              embed=disnake.Embed(
                                  title=':x:Доступ запрещен',
                                  description=f'Ты не разработчик -_-',
                                  colour=0xf00a0a))
    names = "\n".join(f"{x}" for x in bot.guilds)
    ids = "\n".join(f"{x.id}" for x in bot.guilds)
    embed = disnake.Embed(title='Все сервера',
                          description=f'',
                          colour=0xf00a0a)
    embed.add_field(name=f'Названия:', value=f'```{names}```')
    embed.add_field(name=f'\n\nID:', value=f'```{ids}```')
    await ctx.send(embed=embed)


@bot.command()
async def send(ctx, member: disnake.Member, *, message=None):
    for guild in bot.guilds:
        for channel in guild.text_channels:
            if channel.permissions_for(member).send_messages:
                await guild.text_channels[0].send(embed=disnake.Embed(
                    description=message, colour=disnake.Color.red()))
                break


@bot.command()
async def inv(ctx, server_id: int):
    global dev_ids
    if not ctx.author.id in dev_ids:
        return await ctx.send("**Xмм...**",
                              embed=disnake.Embed(
                                  title=':x:Доступ запрещен',
                                  description=f'Ты не разработчик -_-',
                                  colour=0xf00a0a))
    guild = bot.get_guild(server_id)
    invite = await guild.text_channels[0].create_invite(max_age=0,
                                                        max_uses=0,
                                                        temporary=False)
    await ctx.send(f"https://discord.com/{invite.code}")


@bot.command()
async def echo(ctx, *, msg: str = None):
    global dev_ids
    if not ctx.author.id in dev_ids:
        return await ctx.send("**Xмм...**",
                              embed=disnake.Embed(
                                  title=':x:Доступ запрещен',
                                  description=f'Ты не разработчик -_-',
                                  colour=0xf00a0a))
    await ctx.message.delete()
    await ctx.send(embed=disnake.Embed(description=msg))


@bot.command()
async def idea(ctx, *, idea=None):
    await ctx.message.delete()
    if idea is None:
        embed = disnake.Embed(title="❌ | Ошибка",
                              description=">>> Укажите идею `#idea [идея]`",
                              color=disnake.Color.red())
        await ctx.send(embed=embed)
    else:
        member = await bot.fetch_channel(993546789309403296)
        embed = disnake.Embed(
            title="Новая Идея!",
            description=
            f">>> **Отправитель:**\n`{ctx.author}`\n\n**Айди:**\n`{ctx.author.id}`\n\n**Идея:**\n`{idea}`",
            color=disnake.Color.green())
        await member.send(embed=embed)
        embed2 = disnake.Embed(
            title="✅ | Успешно!",
            description=
            f">>> Идея была отправлена разработчикам на расмотрение",
            color=disnake.Color.green())

        await ctx.send(embed=embed2)


@bot.command()
async def bug(ctx, *, bug=None):
    await ctx.message.delete()
    if bug is None:
        embed = disnake.Embed(title="❌ | Ошибка",
                              description=">>> Укажите баг `#bug [баг]`",
                              color=disnake.Color.red())
        await ctx.send(embed=embed)
    else:
        member = await bot.fetch_channel(993573116305481850)
        embed = disnake.Embed(
            title="Новый баг!",
            description=
            f">>> **Отправитель:**\n`{ctx.author}`\n\n**Айди:**\n`{ctx.author.id}`\n\n**Баг:**\n`{bug}`",
            color=disnake.Color.green())
        await member.send(embed=embed)
        embed2 = disnake.Embed(
            title="✅ | Успешно!",
            description=f">>> Баг был отправлен разработчикам на расмотрение",
            color=disnake.Color.green())
        await ctx.author.send(embed=embed2)


@bot.command(aliases=['Ping', 'пинг', 'Пинг'])
async def ping(ctx):
    if not ctx.author.id in dev_ids:
        return await ctx.send("**Xмм...**",
                              embed=disnake.Embed(
                                  title=':x:Доступ запрещен',
                                  description=f'Ты не разработчик -_-',
                                  colour=0xf00a0a))
    ping = bot.ws.latency
    message = await ctx.send('Пожалуйста, подождите. . .')
    await message.edit(
        embed=disnake.Embed(title='Понг',
                            description=f'`{ping * 1000:.0f}ms` :ping_pong:',
                            colour=0x0059ff))


@bot.command(aliases=[
    'bot-info', 'Бот-Инфо', 'бот-инфо', 'инфо-бот', 'Инфо-Бот', 'Инфо-бот',
    'infobot'
])
async def botinfo(ctx):
    embed = disnake.Embed(title='Информация обо мне',
                          description="""
**Меня зовут `EpicBot`**\n ```Я создан,чтобы защищать сервера от рейдеров и крашеров и не только``` \n **Мой префикс:** `#` \n **Команда помощи** `#help` """,
                          colour=15105570)
    embed.add_field(name='**Разработчики**',
                    value='<@834377109945319488>, <@692071250968969266>')
    embed.add_field(name='Бд', value='`Sqlite3`', inline=True)
    embed.add_field(
        name='Пригласить меня',
        value=
        f'[клик](https://disnake.com/api/oauth2/authorize?bot_id=985938937493192874&permissions=8&scope=bot)',
        inline=True)
    embed.add_field(name='Сервер поддержки',
                    value='[Клик](https://disnake.gg/MwTY7vYRb4)',
                    inline=True)
    embed.set_footer(
        text='Все права защищены | EpicBot',
        icon_url=
        'https://cdn.disnakeapp.com/avatars/985938937493192874/1cbce5e5e511f9841e7de58fdd605fe0.png?size=512'
    )
    await ctx.message.add_reaction('✅')
    await ctx.send(embed=embed)


bot.run(os.getenv("token"))
