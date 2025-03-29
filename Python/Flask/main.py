import ctypes
import string
import os
import time

USE_WEBHOOK = True


time.sleep(3)
os.system('cls' if os.name == 'nt' else 'clear')


try:  # Проверьте, были ли установлены требования
    from discord_webhook import DiscordWebhook  # Попробуйте импортировать discord_webhook
except ImportError:  # Если он не может быть установлен
# Сообщите пользователю, что он не был установлен и как его установить
    input(
        f"Модуль discord_webhook не установлен, для установки запустите '{'py -3' if os.name == 'nt' else 'python3.8'} -m pip install discord_webhook'\nВы можете игнорировать эту ошибку, если не собираетесь использовать веб-перехватчик.\nНажмите Enter, чтобы продолжить.")
    USE_WEBHOOK = False
try:  # Оператор установки try, чтобы поймать ошибку
    import requests  # Попробуйте импортировать запросы
except ImportError:  # Если он не был установлен
    # Сообщите пользователю, что он не был установлен, и как его установить
    input(
        f"Модуль requests не установлен, для установки запустите '{'py -3' if os.name == 'nt' else 'python3.8'} -m pip install requests'\nНажмите Enter, чтобы выйти")
    exit()  # Выйти из программы
try:  # Оператор установки try, чтобы поймать ошибку
    import numpy  # Попробуйте импортировать запросы
except ImportError:  # Если он не был установлен
# Сообщите пользователю, что он не был установлен и как его установить
    input(
        f"Модуль numpy не установлен, для установки запустите '{'py -3' if os.name == 'nt' else 'python3.8'} -m pip install numpy'\nНажмите Enter, чтобы выйти")
    exit()  # Выйти из программы

# проверить, подключен ли пользователь к интернету
url = "https://github.com"
try:
    response = requests.get(url)  # Получить ответ от URL
    print("Internet check")
    time.sleep(.4)
except requests.exceptions.ConnectionError:
    # Сообщите пользователю
    input("You are not connected to internet, check your connection and try again.\nPress enter to exit")
    exit()  # Выход из программы


class NitroGen:  # Инициализировать класс
    def __init__(self):  # Функция инициализации
        self.fileName = "Nitro Codes.txt"  # Установите имя файла, в котором хранятся коды

    def main(self):  # Основная функция содержит самый важный код
        os.system('cls' if os.name == 'nt' else 'clear')  # Очистить экран
        if os.name == "nt":  # Если система windows
            print("")
            ctypes.windll.kernel32.SetConsoleTitleW(
                "Нитро генератор и проверки - Сделал 栗原#2478")  # Не изменять
        else:  # Или если это unix
            print(f'\33]0;Нитро генератор и проверки - Сделал 栗原#2478\a',
                  end='', flush=True)  # Обновить заголовок командной строки

        print(""" █████╗ ███╗   ██╗ ██████╗ ███╗   ██╗██╗██╗  ██╗
██╔══██╗████╗  ██║██╔═══██╗████╗  ██║██║╚██╗██╔╝
███████║██╔██╗ ██║██║   ██║██╔██╗ ██║██║ ╚███╔╝
██╔══██║██║╚██╗██║██║   ██║██║╚██╗██║██║ ██╔██╗
██║  ██║██║ ╚████║╚██████╔╝██║ ╚████║██║██╔╝ ██╗
╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝
                                                        """)  # Вывисти титул
        time.sleep(2)  # Подождите несколько секунд
        time.sleep(1)  # Подожди еще немного
        # Вывести первый вопрос
        self.slowType(
            "\nВведите, сколько кодов нужно сгенерировать и проверить: ", .02, newLine=False)

        try:
            num = int(input(''))  # Спросите у пользователя количество кодов
        except ValueError:
            input("Specified input wasn't a number.\nPress enter to exit")
            exit()  # Выход из программы

        if USE_WEBHOOK:
            # Получите URL-адрес веб-перехватчика, если пользователь не хочет использовать веб-перехватчик, сообщение будет пустой строкой.
            
            self.slowType(
                "Если вы хотите использовать веб-хук Discord, введите его здесь или нажмите Enter, чтобы игнорировать: ", .02, newLine=False)
            url = input('')  # Получить авсер
# Если URL-адрес пуст, вставляем None
            webhook = url if url != "" else None
            
            if webhook is not None:
                DiscordWebhook(  # Дайте пользователю знать, что он начал регистрировать идентификаторы
                        url=url,
                        content=f"```Началась проверка URL\nЯ буду присылать сюда все действительные коды```"
                    ).execute()

        

        valid = []  # Следит за действительными кодами
        invalid = 0  # Следит за тем, сколько неверных кодов было обнаружено
        chars = []
        chars[:0] = string.ascii_letters + string.digits

        # генерировать коды быстрее, чем при использовании random.choice
        c = numpy.random.choice(chars, size=[num, 23])
        for s in c:  # Перебрать количество кодов для проверки
            try:
                code = ''.join(x for x in s)
                url = f"https://discord.gift/{code}"  # Создать URL-адрес

                result = self.quickChecker(url, webhook)  # Проверяет коды

                if result:  # Если код был действителен
# Добавляем этот код в список найденных кодов
                    valid.append(url)
                else:  # Если код недействителен
                    invalid += 1  # Увеличьте недействительный счетчик на единицу
            except KeyboardInterrupt:
                # Если пользователь прервал программу
                print("\nПрервано пользователем")
                break  # Разорвать петлю

            except Exception as e:  # Если запрос не выполнен
                print(f" Error | {url} ")  # Сообщите пользователю, что произошла ошибка

            if os.name == "nt":  # Если система windows
                ctypes.windll.kernel32.SetConsoleTitleW(
                    f"Генератор и проверка нитро - {len(valid)} действительны | {invalid} недействительны - Сделал 栗原#2478")  # Не изменять название
                print("")
            else:  # Если это unix система
                # Не изменять название
                print(
                    f'\33]0;Генератор и проверка нитро - {len(valid)} действительны | {invalid} недействительны - Сделал 栗原#2478\a', end='', flush=True)

        print(f"""
Результат:
 действительны: {len(valid)}
 недействительны: {invalid}
 Действительные коды: {', '.join(valid)}""")  # Предоставить отчет о результатах проверки

        # Сообщите пользователю, что программа завершена
        input("\nКонец! Нажмите Enter 5 раз, чтобы закрыть программу.")
        [input(i) for i in range(4, 0, -1)]  # Дождитесь 4 нажатий ввода

    # Функция, используемая для более удобной печати текста.
    def slowType(self, text: str, speed: float, newLine=True):
        for i in text:  #Цикл по сообщению
# Напечатать один символ, для того чтобы заставить python напечатать символ, используется flush
            print(i, end="", flush=True)
            time.sleep(speed)  
        if newLine:  # Проверьте, установлен ли для аргумента newLine значение True.
            print()  # Напечатайте последнюю новую строку, чтобы она действовала как обычный оператор печати.

    def quickChecker(self, nitro:str, notify=None):  # Используется для проверки одного кода за раз
# Генерируем URL-адрес запроса
        url = f"https://discordapp.com/api/v9/entitlements/gift-codes/{nitro}?with_application=false&with_subscription_plan=true"
        response = requests.get(url)  #Получить ответ от discord

        if response.status_code == 200:  # Если ответ прошел
# Сообщите пользователю, что код действителен
            print(f" Valid | {nitro} ", flush=True,
                  end="" if os.name == 'nt' else "\n")
            with open("Nitro Codes.txt", "w") as file:  # Откройте файл для записи
# Запишите код нитро в файл, он автоматически добавит новую строку
                file.write(nitro)

            if notify is not None:  # Если вебхук был добавлен
                DiscordWebhook(  # Отправьте сообщение в раздор, сообщив пользователю, что был действующий код нитро.
                    url=url,
                    content=f"Обнаружен действительный код Nito! @everyone \n{nitro}"
                ).execute()

            return True  # Сообщить основной функции, что код найден

# Если ответ был проигнорирован или недействителен (например, 404 или 405)
        else:
            # Сообщите пользователю, что он проверил код, и он оказался недействительным.
            print(f" недействительный | {nitro} ", flush=True,
                  end="" if os.name == 'nt' else "\n")
            return False  # Сообщить основной функции, что код не найден


if __name__ == '__main__':
    Gen = NitroGen()  # Создайте объект генератора нитро
    Gen.main()  # Запустите основной код