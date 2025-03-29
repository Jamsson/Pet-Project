import discord
from discord.ext import commands

class Greetings(commands.Cog):
    def __init__(self, client):
        self.client = client

class Select(discord.ui.Select):
    def __init__(self):
        options=[
            discord.SelectOption(label="Option 1",description="Пункт 1!"),
            discord.SelectOption(label="Option 2",description="Пункт 2!"),
            discord.SelectOption(label="Option 3",description="Пункт 3!")
            ]
        super().__init__(placeholder="Выбери что-то одно",max_values=1,min_values=1,options=options)
    async def callback(self, interaction: discord.Interaction):
        if self.values[0] == "Option 1":
            await interaction.response.edit_message(content="Вывод при выборе пункта 1")
        elif self.values[0] == "Option 2":
            await interaction.response.send_message("Вывод при выборе пункта 2")
        elif self.values[0] == "Option 3":
            await interaction.response.send_message("Вывод при выборе пункта 3")

await client.add_cog(Greetings(client))