import disnake
from disnake.ext import commands
from disnake import TextInputStyle

import os

#from keep_alive import keep_alive

import asyncio
import random
import datetime, time

for filename in os.listdir('./cogs'):
  in filename.endswith('.py'):
    client.load_extension(f'cogs.{filename[:-3]}')

class Idea(disnake.ui.Modal):
    def __init__(self):
        components = [
            disnake.ui.TextInput(
                label="Заголовок",
                placeholder="Темя идей",
                custom_id="тема",
                style=TextInputStyle.short,
                max_length=50,
            ),
            disnake.ui.TextInput(
                label="Описание",
                placeholder='Напишите свою идею',
                custom_id="описание",
                style=TextInputStyle.paragraph,
            ),
        ]
        super().__init__(
            title="Идея",
            custom_id="create_tag",
            components=components,
        )

    
    async def callback(self, inter):
        embed = disnake.Embed(title="Новая идея")
        for key, value in inter.text_values.items():
            embed.add_field(
                name=key.capitalize(),
                value=value[:1024],
                inline=False,
            )
            embed.set_footer(text = f'Отправил: {inter.author.name}')
        channel = client.get_channel(1005905296834707526)
        await channel.send(embed=embed)
        await inter.author.send('Идея была отправлена на рассмотрение')

class PersistentView(disnake.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @disnake.ui.button(
        label="🔰 | Идея", style=disnake.ButtonStyle.green, custom_id="idea"
    )
    async def idea(self, button, inter):
      await inter.response.send_modal(modal=Idea())
      

class Jaloba(disnake.ui.Modal):
    def __init__(self):
        components = [
            disnake.ui.TextInput(
                label="Заголовок",
                placeholder="Темя жалобы",
                custom_id="тема",
                style=TextInputStyle.short,
                max_length=50,
            ),
            disnake.ui.TextInput(
                label="Нарушитель",
                placeholder="Укажите ID нарушителя",
                custom_id="iD нарушителя",
                style=TextInputStyle.short,
                max_length=20,
            ),
            disnake.ui.TextInput(
                label="Описание",
                placeholder='Напишите что сделал нарушилель',
                custom_id="описание",
                style=TextInputStyle.paragraph,
            ),
            disnake.ui.TextInput(
                label="Доказательства",
                placeholder="Прикрепите ссылку на Фото/Видео",
                custom_id="ссылка",
                style=TextInputStyle.short,
                max_length=150,
            ),
        ]
        super().__init__(
            title="Жалоба",
            custom_id="create_tag",
            components=components,
        )

    async def callback(self, inter):
        embed = disnake.Embed(title="Новая жалоба")
        for key, value in inter.text_values.items():
            embed.add_field(
                name=key.capitalize(),
                value=value[:1024],
                inline=False,
            )
            embed.set_footer(text = f'Отправил: {inter.author.name}')
        channel = client.get_channel(1005905371635920896)
        await channel.send(embed=embed)

class Persistent(disnake.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @disnake.ui.button(
        label="🚫 | Жалоба", style=disnake.ButtonStyle.red, custom_id="jaloba"
    )
    async def jaloba(self, button, inter):
      await inter.response.send_modal(modal=Jaloba())
      await inter.author.send('Жалоба была отправлена на рассмотрение')

class VS(disnake.ui.Modal):
    def __init__(self):
        components = [
            disnake.ui.TextInput(
                label="Название страны",
                placeholder="Введите название страны",
                custom_id="страна",
                style=TextInputStyle.short,
                max_length=50,
            ),
            disnake.ui.TextInput(
                label="Территории",
                placeholder='Введите территории вашей страны',
                custom_id="территории",
                style=TextInputStyle.paragraph,
            ),
            disnake.ui.TextInput(
                label="Флаг страны",
                placeholder='Введите флаг вашей страны',
                custom_id="флаг",
                style=TextInputStyle.short,
                max_length=3,
            ),
        ]
        super().__init__(
            title="Выбор стран",
            custom_id="create_tag",
            components=components,
        )

    async def callback(self, inter):
        embed = disnake.Embed(title="Новая страна")
        for key, value in inter.text_values.items():
            embed.add_field(
                name=key.capitalize(),
                value=value[:1024],
                inline=False,
            )
            embed.set_footer(text = f'Отправил: {inter.author.name}')
        channel = client.get_channel(1005905452019748883)
        await channel.send(embed=embed)

class Strana(disnake.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @disnake.ui.button(
        label="🔰 | Выбрать страну", style=disnake.ButtonStyle.green, custom_id="strana"
    )
    async def strana(self, button, inter):
      await inter.response.send_modal(modal=VS())
      await inter.author.send('Ваша страна была отправлена на рассмотрение')

class Nabor(disnake.ui.Modal):
    def __init__(self):
        components = [
            disnake.ui.TextInput(
                label="Имя",
                placeholder="Введите своё имя или псевдоним",
                custom_id="имя",
                style=TextInputStyle.short,
                max_length=50,
            ),
            disnake.ui.TextInput(
                label="Возраст",
                placeholder='Введите свой возраст',
                custom_id="возраст",
                style=TextInputStyle.short,
                max_length=3,
            ),
            disnake.ui.TextInput(
                label="Опыт",
                placeholder='Опыт в этой сфере(0/10)',
                custom_id="опыт",
                style=TextInputStyle.short,
                max_length=5,
            ),
            disnake.ui.TextInput(
                label="Партнерка",
                placeholder='Сколько партнерок в день сможнте(минимум 5)',
                custom_id="партнерок-в-день",
                style=TextInputStyle.short,
                max_length=3,
            ),
            disnake.ui.TextInput(
                label="Развитие сервера",
                placeholder='Готовы помогать и развиать этот сервер?',
                custom_id="развитие",
                style=TextInputStyle.paragraph,
            ),
            disnake.ui.TextInput(
                label="Парвила",
                placeholder='Вы провитали Правила партнерки и Нон рп правила?',
                custom_id="парвила",
                style=TextInputStyle.paragraph,
            ),
        ]
        super().__init__(
            title="Пиар менержер",
            custom_id="create_tag",
            components=components,
        )

    async def callback(self, inter):
        embed = disnake.Embed(title="Новая заявка на пиар мереджер")
        for key, value in inter.text_values.items():
            embed.add_field(
                name=key.capitalize(),
                value=value[:1024],
                inline=False,
            )
            embed.set_footer(text = f'Отправил: {inter.author.name}')
        channel = client.get_channel(1005905452019748883)
        await channel.send(embed=embed)

class Piar(disnake.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @disnake.ui.button(
        label="🔰 | Пиар менеджер", style=disnake.ButtonStyle.green, custom_id="piars"
    )
    async def piars(self, button, inter):
      await inter.response.send_modal(modal=Nabor())
      await inter.author.send('Ваша заявка была отправлена на рассмотрение')

class Nabr(disnake.ui.Modal):
    def __init__(self):
        components = [
            disnake.ui.TextInput(
                label="Имя",
                placeholder="Введите своё имя",
                custom_id="имя",
                style=TextInputStyle.short,
                max_length=50,
            ),
            disnake.ui.TextInput(
                label="Возраст",
                placeholder='Введите свой возраст',
                custom_id="возраст",
                style=TextInputStyle.short,
                max_length=3,
            ),
            disnake.ui.TextInput(
                label="Опыт",
                placeholder='Опыт в этой сфере(0/10)',
                custom_id="опыт",
                style=TextInputStyle.short,
                max_length=5,
            ),
            disnake.ui.TextInput(
                label="О себе",
                placeholder='Расскажите о себе(3-4 предложения)',
                custom_id="о-себе",
                style=TextInputStyle.paragraph,
                max_length=3,
            ),
            disnake.ui.TextInput(
                label="О должности",
                placeholder='Расскажите о должности(3-4 предложения)',
                custom_id="о-должности",
                style=TextInputStyle.paragraph,
            ),
            disnake.ui.TextInput(
                label="Актив",
                placeholder='Готовы поднимать актив и следить за сервером?',
                custom_id="парвила",
                style=TextInputStyle.short,
                max_length=10,
            ),
        ]
        super().__init__(
            title="Выбор стран",
            custom_id="create_tag",
            components=components,
        )

    async def callback(self, inter):
        embed = disnake.Embed(title="Новая страна")
        for key, value in inter.text_values.items():
            embed.add_field(
                name=key.capitalize(),
                value=value[:1024],
                inline=False,
            )
            embed.set_footer(text = f'Отправил: {inter.author.name}')
        channel = client.get_channel(1005905452019748883)
        await channel.send(embed=embed)

class Helper(disnake.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @disnake.ui.button(
        label="🔰 | Выбрать страну", style=disnake.ButtonStyle.green, custom_id="strana"
    )
    async def strana(self, button, inter):
      await inter.response.send_modal(modal=Nabor())
      await inter.author.send('Ваша заявка была отправлена на рассмотрение')



client = commands.Bot(command_prefix='$', help_command=None, intents=disnake.Intents.all())


@client.command()
@commands.has_permissions(administrator=True)
async def модал(ctx, *, arg = None):
    await ctx.message.delete()
    if arg == None:
        await ctx.send(embed = disnake.Embed(title = 'Ошибка', description = 'Вы забыли указать аргумент.\nДеиствительные аргументы: идея | жалоба | страна | пиар | xелпер | модер ', color = disnake.Color.red()))
    elif arg == "идея":
        emb = disnake.Embed(
            description = 
            f"""
            **Нажмите на кнопку чтобы предложить идею для __Сервера__**

**‼️ | Запрещено**
• Предлагать не по теме сервера
• Тролить
• Рекламировать свои источники или другое

**🎯 | Наказание**
__Мут на 1 день__

**🔎 | Другое**
• Ваши идеи проверяют только Создатель сервера и <@!834377109945319488>
• Если приватное сообщения нечего не прыслало здесь, то возможно вы что-то не так сделали + оно не отправиться в специальный канал для просмотра идеи.
            """,
            colour = 0xFF8C00
        )
        emb.set_thumbnail(url = 'https://cdn.disnakeapp.com/attachments/772850448892690462/880752123418136596/947d1f802c858b540b84bc3000fc2439_1_-removebg-preview.png')
        emb.set_author(name = '🔰 | Идея')
        await ctx.send(embed = emb, view=PersistentView())
    elif arg == 'жалоба':
        emb = disnake.Embed(
            description = 
            f"""
            **Нажмите на кнопку чтобы подать жалобу на участника**

**📫 | Игнорим**
• Краш другого сервера
• Указанный участник крашер
• Нарушение правил нашего сервера через другой сервер

**‼️ | Запрещено**
• Писать в не адекватном виде
• Рекламировать свои источники или другое

**🎯 | Наказание**
__Мут на 1 день__

**🔎 | Другое**
• Вашу жалобу просматривают только Создатель сервера и <@!834377109945319488>
• Если приватное сообщения нечего не прыслало здесь, то возможно вы что-то не так сделали + оно не отправиться в специальный канал для просмотра жалобы.
            """,
            colour = 0xFF8C00
        )
        emb.set_thumbnail(url = 'https://cdn.disnakeapp.com/attachments/772850448892690462/880752123418136596/947d1f802c858b540b84bc3000fc2439_1_-removebg-preview.png')
        emb.set_author(name = '🚫 | Жалоба')
        await ctx.send(embed = emb, view=Persistent())
    elif arg == 'страна':
        emb = disnake.Embed(
            description = 
            f"""
            **Нажмите на кнопку чтобы __выбрать страну__**

**‼️ | Запрещено**
• Предлагать не по теме сервера
• Тролить
• Рекламировать свои источники или другое

**🎯 | Наказание**
__Мут на 1 день__

**🔎 | Другое** 
• Ваши выбор стран проверяют только Создатель сервера и <@!834377109945319488>
• Если приватное сообщения нечего не прыслало здесь, то возможно вы что-то не так сделали + оно не отправиться в специальный канал для просмотра.
        """,
            colour = 0xFF8C00
        )
        emb.set_footer(text = f'Если флага нету в эмоджи то ссылку на флаг можно отправить в лс `童磨#2478` или `шохжахон#0001`')
        emb.set_thumbnail(url = 'https://cdn.disnakeapp.com/attachments/772850448892690462/880752123418136596/947d1f802c858b540b84bc3000fc2439_1_-removebg-preview.png')
        emb.set_author(name = '🔰 | Выбор стран')
        await ctx.send(embed = emb, view=Strana())
    elif arg == 'пиар':
        emb = disnake.Embed(
            description = 
            f"""
            **Нажмите на кнопку чтобы подать заявку __на пиар менеджера__**

**‼️ | Запрещено**
• Писать не по теме сервера
• Тролить
• Рекламировать свои источники или другое

**🎯 | Наказание**
__Мут на 1 день__

**🔎 | Другое** 
• Вашу заявку проверяют только Создатель сервера и <@!834377109945319488>
• Если приватное сообщения нечего не прыслало здесь, то возможно вы что-то не так сделали + оно не отправиться в специальный канал для просмотра.
        """,
            colour = 0xFF8C00
        )
        emb.set_thumbnail(url = 'https://cdn.disnakeapp.com/attachments/772850448892690462/880752123418136596/947d1f802c858b540b84bc3000fc2439_1_-removebg-preview.png')
        emb.set_author(name = '🔰 | Пиар менеджер')
        await ctx.send(embed = emb, view=Piar())
    elif arg == 'пиар':
        emb = disnake.Embed(
            description = 
            f"""
            **Нажмите на кнопку чтобы подать заявку __на пиар менеджера__**

**‼️ | Запрещено**
• Писать не по теме сервера
• Тролить
• Рекламировать свои источники или другое

**🎯 | Наказание**
__Мут на 1 день__

**🔎 | Другое** 
• Вашу заявку проверяют только Создатель сервера и <@!834377109945319488>
• Если приватное сообщения нечего не прыслало здесь, то возможно вы что-то не так сделали + оно не отправиться в специальный канал для просмотра.
        """,
            colour = 0xFF8C00
        )
        emb.set_thumbnail(url = 'https://cdn.disnakeapp.com/attachments/772850448892690462/880752123418136596/947d1f802c858b540b84bc3000fc2439_1_-removebg-preview.png')
        emb.set_author(name = '🔰 | Пиар менеджер')
        await ctx.send(embed = emb, view=Piar())

#@client.event
#async def on_button_click(inter):

 #   guild = client.get_guild(inter.guild.id)

  #  if inter.component.id == "idea":
   #   await inter.response.send_modal(modal=MyModal())

@client.event
async def on_ready():
    print('Бот онлайн')
    await client.change_presence(status=disnake.Status.idle,
                                 activity=disnake.Game('Играет в 𝑯𝒂𝒓𝒅 𝑹𝒖𝒔𝒔𝒊𝒂'))

@client.command()
@commands.has_role("Giveaway")
async def giveaway(ctx):
    giveaway_questions = [
        'На каком канале я буду проводить розыгрыш?',
        'Какой будет приз?',
        'Как долго должен длиться розыгрыш (в секундах)?',
    ]
    giveaway_answers = []

    # Checking to be sure the author is the one who answered and in which channel
    def check(m):
        return m.author == ctx.author and m.channel == ctx.channel

    for question in giveaway_questions:
        await ctx.send(question)
        try:
            message = await client.wait_for('message',
                                            timeout=60.0,
                                            check=check)
        except asyncio.TimeoutError:
            await ctx.send(
                'Вы не ответили вовремя. Пожалуйста, попробуйте еще раз и обязательно отправьте ответ в течение 60 секунд после вопроса.'
            )
            return
        else:
            giveaway_answers.append(message.content)

    try:
        c_id = int(giveaway_answers[0][2:-1])
    except:
        await ctx.send(
            f'Вы не правильно указали канал. Пожалуйста, сделайте это так: {ctx.channel.mention}'
        )
        return

    channel = client.get_channel(c_id)
    prize = str(giveaway_answers[1])
    time = int(giveaway_answers[2])

    # Sends a message to let the host know that the giveaway was started properly
    await ctx.send(
        f'Розыгрыш {prize} начнется в ближайшее время.\nОбратите внимание на {channel.mention}, розыгрыш закончится через {time} секунд.'
    )

    give = disnake.Embed(color=0x2ecc71)
    give.set_author(name=f'РОЗЫГРЫШ!',
                    icon_url='https://i.imgur.com/VaX0pfM.png')
    give.add_field(
        name=f'{prize}!',
        value=
        f'Нажмите на 🎉, чтобы войти!\n Закончится: `через {round(time/60, 2)} минут!`',
        inline=False)
    end = datetime.datetime.utcnow() + datetime.timedelta(seconds=time)
    give.set_footer(text=f'Розыгрыш заканчивается в {end} UTC!')
    my_message = await channel.send(embed=give)

    await my_message.add_reaction("🎉")
    await asyncio.sleep(time)

    new_message = await channel.fetch_message(my_message.id)

    users = await new_message.reactions[0].users().flatten()
    users.pop(users.index(client.user))
    winner = random.choice(users)

    winning_announcement = disnake.Embed(color=0xff2424)
    winning_announcement.set_author(name=f'РОЗЫГРЫШ ЗАКОНЧИЛСЯ!',
                                    icon_url='https://i.imgur.com/DDric14.png')
    winning_announcement.add_field(
        name=f'🎉 Приз: {prize}',
        value=
        f'🥳 **Победитель**: {winner.mention}\n 🎫 **Количество участников**: {len(users)}',
        inline=False)
    winning_announcement.set_footer(text='Спасибо за участие!')
    await channel.send(embed=winning_announcement)


@client.command()
@commands.has_role("Giveaway")
async def reroll(ctx, channel: disnake.TextChannel, id_: int):
    # Reroll command requires the user to have a "Giveaway" role to function properly
    try:
        new_message = await channel.fetch_message(id_)
    except:
        await ctx.send("Неверный id.")
        return

    users = await new_message.reactions[0].users().flatten()
    users.pop(users.index(client.user))
    winner = random.choice(users)

    reroll_announcement = disnake.Embed(color=0xff2424)
    reroll_announcement.set_author(
        name=f'Розыгрыш был повторен организатором!',
        icon_url='https://i.imgur.com/DDric14.png')
    reroll_announcement.add_field(name=f'🥳 Новый победитель:',
                                  value=f'{winner.mention}',
                                  inline=False)
    await channel.send(embed=reroll_announcement)


#keep_alive()

client.run(
    os.getenv(
        'Tg3NzMzODI1OTU2MjMzMjI2.GJZW1V.vD_0QN_Kx1GJdZ22DgAlP6_68Is82yIIPCRocR'
    ))
